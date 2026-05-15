import type { Enums } from "@/types/database";

export type Condition = "Any" | "New" | "Certified" | "Used";
export type SortOption = "newest" | "price-low" | "price-high" | "year-newest";

export type BuyFilters = {
  q: string;
  bodyTypes: Enums<"car_type">[];
  transmission: "any" | Enums<"transmission_type">;
  fuels: Enums<"fuel_type">[];
  brand: string;
  model: string;
  sort: SortOption;
  category: Enums<"car_category"> | null;
  minPrice: number | null;
  maxPrice: number | null;
  minYear: number | null;
  maxYear: number | null;
  kmRange: string;
  city: string;
  colors: string[];
  specs: string;
};

export const DEFAULT_BUY_FILTERS: BuyFilters = {
  q: "",
  bodyTypes: [],
  transmission: "any",
  fuels: [],
  brand: "All",
  model: "",
  sort: "newest",
  category: null,
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  kmRange: "",
  city: "",
  colors: [],
  specs: "any",
};

export const KM_RANGES: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "new", label: "Brand New" },
  { value: "under30k", label: "< 30,000" },
  { value: "30k-60k", label: "30K – 60K" },
  { value: "60k-100k", label: "60K – 100K" },
  { value: "over100k", label: "100K+" },
];

export const BODY_TYPES: Enums<"car_type">[] = [
  "suv",
  "coupe",
  "sedan",
  "crossover",
  "hatchback",
  "convertible",
  "hard_top_convertible",
  "sports",
  "van",
  "wagon",
  "truck",
  "jeep",
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
  suv: "SUV",
  coupe: "Coupe",
  sedan: "Sedan",
  crossover: "Cross Over",
  hatchback: "HatchBack",
  convertible: "Soft Top Convertible",
  hard_top_convertible: "Hard Top Convertible",
  sports: "Sports Car",
  van: "Van",
  wagon: "Wagon",
  truck: "Truck",
  jeep: "Jeep",
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

export const UAE_CITIES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

export const COLOR_OPTIONS = [
  { value: "white",  label: "White",  hex: "#F0F0F0", border: true },
  { value: "black",  label: "Black",  hex: "#1A1A1A" },
  { value: "silver", label: "Silver", hex: "#B8B8B8" },
  { value: "grey",   label: "Grey",   hex: "#6B6B6B" },
  { value: "red",    label: "Red",    hex: "#DC2626" },
  { value: "blue",   label: "Blue",   hex: "#2563EB" },
  { value: "green",  label: "Green",  hex: "#16A34A" },
  { value: "brown",  label: "Brown",  hex: "#78350F" },
  { value: "beige",  label: "Beige",  hex: "#D4B483", border: true },
  { value: "gold",   label: "Gold",   hex: "#C9A84C" },
  { value: "orange", label: "Orange", hex: "#EA580C" },
  { value: "maroon", label: "Maroon", hex: "#7F1D1D" },
  { value: "purple", label: "Purple", hex: "#7C3AED" },
  { value: "yellow", label: "Yellow", hex: "#EAB308" },
];

export const REGIONAL_SPECS: { value: string; label: string }[] = [
  { value: "any",      label: "Any" },
  { value: "gcc",      label: "GCC Specs" },
  { value: "us",       label: "US Specs" },
  { value: "european", label: "European" },
  { value: "japanese", label: "Japanese" },
  { value: "other",    label: "Other" },
];

export function deriveCondition(kmDriven: number): Exclude<Condition, "Any"> {
  if (kmDriven === 0) return "New";
  if (kmDriven < 30000) return "Certified";
  return "Used";
}
