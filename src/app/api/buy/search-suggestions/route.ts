import { createClient } from "@/lib/server";
import { getCarSuggestions } from "@/app/(app)/buy/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  const supabase = await createClient();

  // Always fetch trending (top 8 indexed queries, most searched first)
  const { data: trendingRows } = await supabase
    .from("search_queries")
    .select("query, count")
    .eq("is_indexed", true)
    .order("count", { ascending: false })
    .limit(8);

  const trending = (trendingRows ?? []).map((r) => r.query);

  if (!q) {
    return Response.json({ suggestions: [], trending });
  }

  const { data: cars, error } = await supabase
    .from("cars")
    .select("brand, model, title, location")
    .eq("status", "available")
    .limit(200);

  if (error) {
    return Response.json({ suggestions: [], trending }, { status: 500 });
  }

  const suggestions = getCarSuggestions(cars ?? [], q);

  // Also filter trending that match the current query prefix
  const matchingTrending = trending
    .filter((t) => t.toLowerCase().startsWith(q.toLowerCase()) && t.toLowerCase() !== q.toLowerCase())
    .slice(0, 3);

  return Response.json({ suggestions, trending, matchingTrending });
}
