import { createClient } from "@/lib/server";
import { getCarSuggestions } from "@/app/(app)/buy/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return Response.json({ suggestions: [] });
  }

  const supabase = await createClient();
  const { data: cars, error } = await supabase
    .from("cars")
    .select("brand, model, title, location")
    .eq("status", "available")
    .limit(200);

  if (error) {
    return Response.json({ suggestions: [] }, { status: 500 });
  }

  const suggestions = getCarSuggestions(cars ?? [], q);

  return Response.json({ suggestions });
}
