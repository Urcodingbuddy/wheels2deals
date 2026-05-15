import { NextResponse } from "next/server";
import staticModels from "@/data/car-models.json";

// In-memory cache so we only hit NHTSA once per server instance
let cachedMakes: string[] | null = null;

export const revalidate = 86400;

export async function GET() {
  if (cachedMakes) {
    return NextResponse.json({ makes: cachedMakes });
  }

  const staticMakes = Object.keys(staticModels as Record<string, unknown>);

  try {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json",
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error("NHTSA unavailable");

    const data = await res.json();

    const nhtsaMakes: string[] = (data.Results as { Make_Name: string }[]).map(
      (r) => r.Make_Name.trim()
    );

    // Merge: static first (curated casing), then NHTSA additions not already covered
    const staticLower = new Set(staticMakes.map((m) => m.toLowerCase()));
    const extras = nhtsaMakes.filter((m) => !staticLower.has(m.toLowerCase()));
    const merged = [...staticMakes, ...extras].sort((a, b) =>
      a.localeCompare(b)
    );

    cachedMakes = merged;
    return NextResponse.json({ makes: merged });
  } catch {
    // NHTSA down - return static list only
    const sorted = staticMakes.slice().sort((a, b) => a.localeCompare(b));
    cachedMakes = sorted;
    return NextResponse.json({ makes: sorted });
  }
}
