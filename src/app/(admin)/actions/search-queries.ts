"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) throw new Error("Unauthorized");
  const role = (data.claims as { app_metadata?: { role?: string } })?.app_metadata?.role;
  if (role !== "admin") throw new Error("Unauthorized");
  return supabase;
}

export async function toggleIndexed(id: string, isIndexed: boolean) {
  const supabase = await requireAdmin();
  await supabase
    .from("search_queries")
    .update({ is_indexed: isIndexed })
    .eq("id", id);
  revalidatePath("/admin/search-queries");
}

export async function deleteSearchQuery(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("search_queries").delete().eq("id", id);
  revalidatePath("/admin/search-queries");
}

export async function addCustomQuery(query: string) {
  const supabase = await requireAdmin();
  const trimmed = query.trim();
  if (!trimmed) return;
  const { data: existing } = await supabase
    .from("search_queries")
    .select("id")
    .eq("query", trimmed)
    .single();
  if (existing) {
    await supabase
      .from("search_queries")
      .update({ is_indexed: true, is_custom: true })
      .eq("id", existing.id);
  } else {
    await supabase.from("search_queries").insert({
      query: trimmed,
      is_custom: true,
      is_indexed: true,
      count: 0,
    });
  }
  revalidatePath("/admin/search-queries");
}
