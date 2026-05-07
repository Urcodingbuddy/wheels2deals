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
