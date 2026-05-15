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

// Save full state — indexed cars get positions 1…n, unindexedIds get null
export async function saveCarOrder(ids: string[], unindexedIds: string[] = []) {
  const supabase = await requireAdmin();

  // Null out unindexed cars first
  if (unindexedIds.length > 0) {
    await supabase.from("cars").update({ sort_order: null }).in("id", unindexedIds);
  }

  // Clear then reassign indexed cars sequentially to avoid unique constraint conflicts
  if (ids.length > 0) {
    await supabase.from("cars").update({ sort_order: null }).in("id", ids);
    for (let i = 0; i < ids.length; i++) {
      await supabase.from("cars").update({ sort_order: i + 1 }).eq("id", ids[i]);
    }
  }

  revalidatePath("/buy");
  revalidatePath("/admin/ordering");
}

// Pin a single car to a specific position; bump any car already there
export async function pinCarToPosition(id: string, position: number) {
  const supabase = await requireAdmin();

  // Check if position is occupied
  const { data: occupant } = await supabase
    .from("cars")
    .select("id")
    .eq("sort_order", position)
    .neq("id", id)
    .single();

  if (occupant) {
    // Find the next available slot
    const { data: allIndexed } = await supabase
      .from("cars")
      .select("sort_order")
      .not("sort_order", "is", null)
      .order("sort_order", { ascending: true });

    const used = new Set((allIndexed ?? []).map((r) => r.sort_order));
    let next = position + 1;
    while (used.has(next)) next++;
    await supabase.from("cars").update({ sort_order: next }).eq("id", occupant.id);
  }

  await supabase.from("cars").update({ sort_order: position }).eq("id", id);

  revalidatePath("/buy");
  revalidatePath("/admin/ordering");
}

// Remove a car from the index
export async function unpinCar(id: string) {
  const supabase = await requireAdmin();
  await supabase.from("cars").update({ sort_order: null }).eq("id", id);
  revalidatePath("/buy");
  revalidatePath("/admin/ordering");
}
