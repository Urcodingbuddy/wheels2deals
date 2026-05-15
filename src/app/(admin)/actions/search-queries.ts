"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  if (user.app_metadata?.role !== "admin") throw new Error("Unauthorized");
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

export async function reorderQuery(id: string, direction: "up" | "down", allIds: string[]) {
  const supabase = await requireAdmin();
  const idx = allIds.indexOf(id);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= allIds.length) return;

  await supabase.from("search_queries").update({ sort_order: swapIdx }).eq("id", id);
  await supabase.from("search_queries").update({ sort_order: idx }).eq("id", allIds[swapIdx]);
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
