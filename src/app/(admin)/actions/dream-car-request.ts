"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  if (user.app_metadata?.role !== "admin") throw new Error("Forbidden");
  return { supabase };
}

export type DreamCarStatus = "new" | "contacted" | "fulfilled";

export async function updateDreamCarStatus(
  id: string,
  status: DreamCarStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("dream_car_requests")
      .update({ status })
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/cars");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteDreamCarRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("dream_car_requests")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/cars");
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function restoreDreamCarRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("dream_car_requests")
      .update({ deleted_at: null })
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/cars");
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function permanentDeleteDreamCarRequest(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("dream_car_requests")
      .delete()
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/cars");
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function purgeExpiredDreamCarRequests(): Promise<void> {
  try {
    const { supabase } = await requireAdmin();
    const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from("dream_car_requests")
      .delete()
      .not("deleted_at", "is", null)
      .lt("deleted_at", cutoff);
  } catch {
    // non-critical background cleanup - fail silently
  }
}
