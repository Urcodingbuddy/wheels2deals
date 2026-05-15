import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const q = (query ?? "").trim().toLowerCase();

    if (!q || q.length < 2) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("search_queries")
      .select("id, count")
      .ilike("query", q)
      .single();

    if (existing) {
      await supabase
        .from("search_queries")
        .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("search_queries")
        .insert({ query: q, count: 1, is_indexed: true, is_custom: false });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
