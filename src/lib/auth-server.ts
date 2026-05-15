import { createClient } from "@/lib/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required");
  }

  if (user.app_metadata?.role !== "admin") {
    throw new Error("Admin access required");
  }

  return { supabase, user };
}
