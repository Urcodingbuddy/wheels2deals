import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = await createClient();

    // Increment views_count
    const { data: car } = await supabase
      .from("cars")
      .select("id, views_count")
      .eq("slug", slug)
      .single();

    if (!car) return NextResponse.json({ ok: false }, { status: 404 });

    await Promise.all([
      supabase
        .from("cars")
        .update({ views_count: (car.views_count ?? 0) + 1 })
        .eq("id", car.id),
      supabase
        .from("car_view_logs")
        .insert({ car_id: car.id, slug }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
