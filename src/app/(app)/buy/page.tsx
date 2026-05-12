export const dynamic = "force-dynamic";

import { createClient } from "@/lib/server";
import type { Enums, Tables } from "@/types/database";
import BuyClient from "./BuyClient";
import {
  BODY_TYPES,
  DEFAULT_BUY_FILTERS,
  type BuyFilters,
  type Condition,
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
  return ["petrol", "diesel", "electric", "hybrid", "cng", "lpg"].includes(
    value,
  );
}

function isTransmission(
  value: string,
): value is "any" | Enums<"transmission_type"> {
  return ["any", "manual", "automatic", "cvt", "amt"].includes(value);
}

function isCondition(value: string): value is Condition {
  return ["Any", "New", "Certified", "Used"].includes(value);
}

function isSortOption(value: string): value is SortOption {
  return ["newest", "price-low", "price-high", "year-newest"].includes(value);
}

function isBodyType(value: string): value is Enums<"car_type"> {
  return BODY_TYPES.includes(value as Enums<"car_type">);
}

function parseFilters(
  params: Record<string, SearchParamValue>,
): BuyFilters {
  const q = getSingleParam(params.q).trim();
  const condition = isCondition(getSingleParam(params.condition))
    ? (getSingleParam(params.condition) as Condition)
    : DEFAULT_BUY_FILTERS.condition;
  const transmission = isTransmission(getSingleParam(params.transmission))
    ? (getSingleParam(params.transmission) as BuyFilters["transmission"])
    : DEFAULT_BUY_FILTERS.transmission;
  const sort = isSortOption(getSingleParam(params.sort))
    ? (getSingleParam(params.sort) as SortOption)
    : DEFAULT_BUY_FILTERS.sort;
  const brand = getSingleParam(params.brand).trim() || DEFAULT_BUY_FILTERS.brand;
  const bodyTypes = getMultiParam(params.type).filter(isBodyType);
  const fuels = getMultiParam(params.fuel).filter(isFuelType);
  const category = (getSingleParam(params.category) as Enums<"car_category">) || null;

  return {
    q,
    condition,
    bodyTypes,
    transmission,
    fuels,
    brand,
    sort,
    category,
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

  let carsQuery = supabase
    .from("cars")
    .select("*")
    .eq("status", "available");

  if (filters.condition === "New") {
    carsQuery = carsQuery.eq("km_driven", 0);
  } else if (filters.condition === "Certified") {
    carsQuery = carsQuery.gt("km_driven", 0).lt("km_driven", 30000);
  } else if (filters.condition === "Used") {
    carsQuery = carsQuery.gte("km_driven", 30000);
  }

  if (filters.bodyTypes.length > 0) {
    carsQuery = carsQuery.in("type", filters.bodyTypes);
  }

  if (filters.transmission !== "any") {
    carsQuery = carsQuery.eq("transmission", filters.transmission);
  }

  if (filters.fuels.length > 0) {
    carsQuery = carsQuery.in("fuel_type", filters.fuels);
  }

  if (filters.brand !== "All") {
    carsQuery = carsQuery.ilike("brand", `%${filters.brand}%`);
  }

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
      carsQuery = carsQuery.order("created_at", { ascending: false });
      break;
  }

  if (filters.category) {
    carsQuery = carsQuery.eq("category", filters.category);
  }

  const [{ data: cars }, { data: brandRows }] = await Promise.all([
    carsQuery,
    supabase.from("cars").select("brand").eq("status", "available").order("brand"),
  ]);

  const matchedCars = filters.q
    ? (cars ?? []).filter((car) => matchesCarSearch(car, filters.q))
    : (cars ?? []);

  // Fetch recommendations if results are low
  let otherCars: Car[] = [];
  if (matchedCars.length < 6) {
    const matchedIds = matchedCars.map(c => c.id);
    const { data: recommendations } = await supabase
      .from("cars")
      .select("*")
      .eq("status", "available")
      .not("id", "in", `(${matchedIds.length > 0 ? matchedIds.join(",") : "00000000-0000-0000-0000-000000000000"})`)
      .limit(8)
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
