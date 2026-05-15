"use server";

import { createClient } from "@/lib/server";
import type { Enums } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) throw new Error("Unauthorized");
  const role = (data.claims as { app_metadata?: { role?: string } })?.app_metadata?.role;
  if (role !== "admin") throw new Error("Forbidden");
  return { supabase };
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: Enums<"inquiry_status">
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", inquiryId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}

export async function softDeleteInquiry(
  inquiryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("inquiries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", inquiryId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}

export async function restoreInquiry(
  inquiryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("inquiries")
      .update({ deleted_at: null })
      .eq("id", inquiryId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}

export async function permanentDeleteInquiry(
  inquiryId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", inquiryId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
}

export async function purgeExpiredInquiries(): Promise<void> {
  try {
    const { supabase } = await requireAdmin();
    const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from("inquiries")
      .delete()
      .not("deleted_at", "is", null)
      .lt("deleted_at", cutoff);
  } catch {
    // non-critical background cleanup - fail silently
  }
}
