import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cars")
    .select("id, title, sort_order")
    .not("sort_order", "is", null)
    .eq("status", "available")
    .order("sort_order", { ascending: true });

  return Response.json({ cars: data ?? [] });
}
