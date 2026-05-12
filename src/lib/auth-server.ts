import { createClient } from "@/lib/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    throw new Error("Authentication required");
  }

  const role = (data.claims as { app_metadata?: { role?: string } })?.app_metadata?.role;
  if (role !== "admin") {
    throw new Error("Admin access required");
  }

  return { supabase, claims: data.claims };
}
