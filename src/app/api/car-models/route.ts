import { NextResponse } from "next/server";
import staticModels from "@/data/car-models.json";

// Per-make in-memory cache
const modelCache = new Map<string, string[]>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make")?.trim();

  if (!make) {
    return NextResponse.json({ models: [] }, { status: 400 });
  }

  const key = make.toLowerCase();
  if (modelCache.has(key)) {
    return NextResponse.json({ models: modelCache.get(key) });
  }

  // Find static models with case-insensitive key match
  const staticEntry = Object.entries(
    staticModels as Record<string, string[]>
  ).find(([k]) => k.toLowerCase() === key);
  const staticList: string[] = staticEntry ? staticEntry[1] : [];

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("NHTSA unavailable");

    const data = await res.json();
    const nhtsaModels: string[] = (
      data.Results as { Model_Name: string }[]
    ).map((r) => r.Model_Name.trim());

    // Merge: static list first (curated), then NHTSA extras
    const staticLower = new Set(staticList.map((m) => m.toLowerCase()));
    const extras = nhtsaModels.filter((m) => !staticLower.has(m.toLowerCase()));
    const merged = [...staticList, ...extras].sort((a, b) =>
      a.localeCompare(b)
    );

    modelCache.set(key, merged);
    return NextResponse.json({ models: merged });
  } catch {
    // NHTSA down - return static list only
    const sorted = staticList.slice().sort((a, b) => a.localeCompare(b));
    modelCache.set(key, sorted);
    return NextResponse.json({ models: sorted });
  }
}
