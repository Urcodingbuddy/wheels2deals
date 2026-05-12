import type { Enums } from "@/types/database";

export type Condition = "Any" | "New" | "Certified" | "Used";
export type SortOption = "newest" | "price-low" | "price-high" | "year-newest";

export type BuyFilters = {
  q: string;
  condition: Condition;
  bodyTypes: Enums<"car_type">[];
  transmission: "any" | Enums<"transmission_type">;
  fuels: Enums<"fuel_type">[];
  brand: string;
  sort: SortOption;
  category: Enums<"car_category"> | null;
};

export const DEFAULT_BUY_FILTERS: BuyFilters = {
  q: "",
  condition: "Any",
  bodyTypes: [],
  transmission: "any",
  fuels: [],
  brand: "All",
  sort: "newest",
  category: null,
};

export const BODY_TYPES: Enums<"car_type">[] = [
  "sedan",
  "suv",
  "hatchback",
  "coupe",
  "convertible",
  "wagon",
  "van",
  "truck",
  "motorcycle",
  "other",
];

export const FUEL_LABELS: Record<Enums<"fuel_type">, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
  cng: "CNG",
  lpg: "LPG",
};

export const TRANSMISSION_LABELS: Record<Enums<"transmission_type">, string> = {
  manual: "Manual",
  automatic: "Automatic",
  cvt: "CVT",
  amt: "AMT",
};

export const BODY_TYPE_LABELS: Record<Enums<"car_type">, string> = {
  sedan: "Sedan",
  suv: "SUV",
  hatchback: "Hatchback",
  coupe: "Coupe",
  convertible: "Convertible",
  wagon: "Wagon",
  van: "Van",
  truck: "Truck",
  motorcycle: "Motorcycle",
  other: "Other",
};

export const CONDITION_STYLE: Record<Exclude<Condition, "Any">, string> = {
  New: "bg-emerald-500 text-white",
  Certified: "bg-sky-500 text-white",
  Used: "bg-[#3A4A20] text-white",
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "year-newest", label: "Latest model year" },
];

export const CATEGORY_LABELS: Record<Enums<"car_category">, string> = {
  economy: "Economy",
  sports: "Sports",
  suv: "SUV",
  luxury: "Luxury",
  exotic: "Exotic",
};

export function deriveCondition(kmDriven: number): Exclude<Condition, "Any"> {
  if (kmDriven === 0) return "New";
  if (kmDriven < 30000) return "Certified";
  return "Used";
}
