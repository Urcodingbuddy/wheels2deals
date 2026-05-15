export const dynamic = "force-dynamic";

import { createClient } from "@/lib/server";
import type { Enums, Tables } from "@/types/database";
import BuyClient from "./BuyClient";
import {
  BODY_TYPES,
  DEFAULT_BUY_FILTERS,
  type BuyFilters,
  type SortOption,
} from "./filters";
import { matchesCarSearch } from "./search";

type Car = Tables<"cars">;

type SearchParamValue = string | string[] | undefined;

function getSingleParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getMultiParam(value: SearchParamValue) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function isFuelType(value: string): value is Enums<"fuel_type"> {
  return ["petrol", "diesel", "electric", "hybrid", "cng", "lpg"].includes(value);
}

function isTransmission(value: string): value is "any" | Enums<"transmission_type"> {
  return ["any", "manual", "automatic", "cvt", "amt"].includes(value);
}

function isSortOption(value: string): value is SortOption {
  return ["newest", "price-low", "price-high", "year-newest"].includes(value);
}

function isBodyType(value: string): value is Enums<"car_type"> {
  return BODY_TYPES.includes(value as Enums<"car_type">);
}

function parseNum(value: string): number | null {
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

function parseFilters(params: Record<string, SearchParamValue>): BuyFilters {
  const q = getSingleParam(params.q).trim();
  const transmission = isTransmission(getSingleParam(params.transmission))
    ? (getSingleParam(params.transmission) as BuyFilters["transmission"])
    : DEFAULT_BUY_FILTERS.transmission;
  const sort = isSortOption(getSingleParam(params.sort))
    ? (getSingleParam(params.sort) as SortOption)
    : DEFAULT_BUY_FILTERS.sort;
  const brand = getSingleParam(params.brand).trim() || DEFAULT_BUY_FILTERS.brand;
  const model = getSingleParam(params.model).trim();
  const bodyTypes = getMultiParam(params.type).filter(isBodyType);
  const fuels = getMultiParam(params.fuel).filter(isFuelType);
  const category = (getSingleParam(params.category) as Enums<"car_category">) || null;

  const minPrice = parseNum(getSingleParam(params.minPrice));
  const maxPrice = parseNum(getSingleParam(params.maxPrice));
  const minYear  = parseNum(getSingleParam(params.minYear));
  const maxYear  = parseNum(getSingleParam(params.maxYear));
  const kmRange  = getSingleParam(params.kmRange);
  const city     = getSingleParam(params.city).trim();
  const colors   = getMultiParam(params.color).map(c => c.toLowerCase());
  const specs    = getSingleParam(params.specs) || "any";

  return {
    q,
    bodyTypes,
    transmission,
    fuels,
    brand,
    model,
    sort,
    category,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    kmRange,
    city,
    colors,
    specs,
  };
}

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchParamValue>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const supabase = await createClient();

  let carsQuery = supabase.from("cars").select("*").eq("status", "available");

  // Kilometers
  switch (filters.kmRange) {
    case "new":      carsQuery = carsQuery.eq("km_driven", 0); break;
    case "under30k": carsQuery = carsQuery.gt("km_driven", 0).lt("km_driven", 30000); break;
    case "30k-60k":  carsQuery = carsQuery.gte("km_driven", 30000).lt("km_driven", 60000); break;
    case "60k-100k": carsQuery = carsQuery.gte("km_driven", 60000).lt("km_driven", 100000); break;
    case "over100k": carsQuery = carsQuery.gte("km_driven", 100000); break;
  }

  // Body type
  if (filters.bodyTypes.length > 0) {
    carsQuery = carsQuery.in("type", filters.bodyTypes);
  }

  // Transmission
  if (filters.transmission !== "any") {
    carsQuery = carsQuery.eq("transmission", filters.transmission);
  }

  // Fuel
  if (filters.fuels.length > 0) {
    carsQuery = carsQuery.in("fuel_type", filters.fuels);
  }

  // Brand
  if (filters.brand !== "All") {
    carsQuery = carsQuery.ilike("brand", `%${filters.brand}%`);
  }

  // Model
  if (filters.model) {
    carsQuery = carsQuery.ilike("model", `%${filters.model}%`);
  }

  // Category
  if (filters.category) {
    carsQuery = carsQuery.eq("category", filters.category);
  }

  // Price range
  if (filters.minPrice !== null) {
    carsQuery = carsQuery.gte("price", filters.minPrice);
  }
  if (filters.maxPrice !== null) {
    carsQuery = carsQuery.lte("price", filters.maxPrice);
  }

  // Year range
  if (filters.minYear !== null) {
    carsQuery = carsQuery.gte("year", filters.minYear);
  }
  if (filters.maxYear !== null) {
    carsQuery = carsQuery.lte("year", filters.maxYear);
  }

  // City
  if (filters.city) {
    carsQuery = carsQuery.ilike("location", `%${filters.city}%`);
  }

  // Color (multi, OR logic via ilike)
  if (filters.colors.length > 0) {
    const orClause = filters.colors.map((c) => `color.ilike.%${c}%`).join(",");
    carsQuery = carsQuery.or(orClause);
  }

  // Regional specs (title ilike — best effort until DB column added)
  if (filters.specs !== "any") {
    const SPEC_KEYWORDS: Record<string, string[]> = {
      gcc:      ["GCC"],
      us:       ["US Spec"],
      european: ["European"],
      japanese: ["Japanese"],
      other:    [],
    };
    const kws = SPEC_KEYWORDS[filters.specs] ?? [];
    if (kws.length > 0) {
      const orClause = kws.map((k) => `title.ilike.%${k}%`).join(",");
      carsQuery = carsQuery.or(orClause);
    }
  }

  // Sort
  switch (filters.sort) {
    case "price-low":
      carsQuery = carsQuery.order("price", { ascending: true });
      break;
    case "price-high":
      carsQuery = carsQuery.order("price", { ascending: false });
      break;
    case "year-newest":
      carsQuery = carsQuery.order("year", { ascending: false });
      break;
    case "newest":
    default:
      carsQuery = carsQuery
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });
      break;
  }

  const [{ data: cars }, { data: brandRows }] = await Promise.all([
    carsQuery,
    supabase.from("cars").select("brand").eq("status", "available").order("brand"),
  ]);

  const matchedCars = filters.q
    ? (cars ?? []).filter((car) => matchesCarSearch(car, filters.q))
    : (cars ?? []);

  // Recommendations when results are sparse
  let otherCars: Car[] = [];
  if (matchedCars.length < 6) {
    const matchedIds = matchedCars.map((c) => c.id);
    const { data: recommendations } = await supabase
      .from("cars")
      .select("*")
      .eq("status", "available")
      .not(
        "id",
        "in",
        `(${matchedIds.length > 0 ? matchedIds.join(",") : "00000000-0000-0000-0000-000000000000"})`,
      )
      .limit(24)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    otherCars = recommendations ?? [];
  }

  const brands = [...new Set((brandRows ?? []).map((car) => car.brand))].sort();

  return (
    <BuyClient
      cars={matchedCars}
      otherCars={otherCars}
      brands={brands}
      filters={filters}
    />
  );
}
