"use client";

import { useMemo, useState, useTransition, useRef, useEffect } from "react";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Car,
  Check,
  ChevronDown,
  ChevronRight,
  Fuel,
  Gauge,
  Globe,
  Heart,
  MapPin,
  Palette,
  RotateCcw,
  Search,
  Settings2,
  SlidersHorizontal,
  Shapes,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Tables } from "@/types/database";
import {
  BODY_TYPES,
  BODY_TYPE_LABELS,
  COLOR_OPTIONS,
  DEFAULT_BUY_FILTERS,
  FUEL_LABELS,
  KM_RANGES,
  REGIONAL_SPECS,
  SORT_OPTIONS,
  TRANSMISSION_LABELS,
  UAE_CITIES,
  CATEGORY_LABELS,
  deriveCondition,
  type BuyFilters,
} from "./filters";
import { KNOWN_BRANDS } from "./search";

type Car = Tables<"cars">;

// ── URL serialisation ─────────────────────────────────────────────────────────

function createSearchParams(filters: BuyFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.brand !== DEFAULT_BUY_FILTERS.brand) params.set("brand", filters.brand);
  if (filters.model) params.set("model", filters.model);
  if (filters.transmission !== DEFAULT_BUY_FILTERS.transmission) params.set("transmission", filters.transmission);
  if (filters.sort !== DEFAULT_BUY_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.category) params.set("category", filters.category);
  if (filters.kmRange) params.set("kmRange", filters.kmRange);
  if (filters.city) params.set("city", filters.city);
  if (filters.specs !== "any") params.set("specs", filters.specs);
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minYear !== null) params.set("minYear", String(filters.minYear));
  if (filters.maxYear !== null) params.set("maxYear", String(filters.maxYear));
  for (const t of filters.bodyTypes) params.append("type", t);
  for (const f of filters.fuels) params.append("fuel", f);
  for (const c of filters.colors) params.append("color", c);
  return params;
}

// ── Active filter chips ───────────────────────────────────────────────────────

type ActiveFilterKey =
  | "q" | "brand" | "model" | "transmission" | "bodyType" | "fuel"
  | "category" | "kmRange" | "city" | "specs" | "priceRange" | "yearRange" | "color";

function formatActiveLabel(filters: BuyFilters, key: ActiveFilterKey, value?: string): string {
  switch (key) {
    case "q":          return `"${filters.q}"`;
    case "brand":      return filters.brand;
    case "model":      return filters.model;
    case "city":       return filters.city;
    case "transmission": return TRANSMISSION_LABELS[filters.transmission as keyof typeof TRANSMISSION_LABELS] ?? "";
    case "bodyType":   return BODY_TYPE_LABELS[value as keyof typeof BODY_TYPE_LABELS] ?? value ?? "";
    case "fuel":       return FUEL_LABELS[value as keyof typeof FUEL_LABELS] ?? value ?? "";
    case "category":   return filters.category ? CATEGORY_LABELS[filters.category] : "";
    case "kmRange":    return KM_RANGES.find(r => r.value === filters.kmRange)?.label ?? "";
    case "specs":      return REGIONAL_SPECS.find(s => s.value === filters.specs)?.label ?? "";
    case "color":      return value ? (value.charAt(0).toUpperCase() + value.slice(1)) : "";
    case "priceRange": {
      const min = filters.minPrice ? `AED ${filters.minPrice.toLocaleString()}` : "";
      const max = filters.maxPrice ? `AED ${filters.maxPrice.toLocaleString()}` : "";
      if (min && max) return `${min} – ${max}`;
      return min ? `From ${min}` : `Up to ${max}`;
    }
    case "yearRange": {
      if (filters.minYear && filters.maxYear) return `${filters.minYear} – ${filters.maxYear}`;
      return filters.minYear ? `From ${filters.minYear}` : `Up to ${filters.maxYear}`;
    }
    default: return key;
  }
}

// ── Section definitions ───────────────────────────────────────────────────────

const FILTER_SECTIONS = [
  { key: "category",     label: "Category",       icon: Tag },
  { key: "city",         label: "City",            icon: MapPin },
  { key: "make",         label: "Brand & Model",   icon: Car },
  // { key: "price",        label: "Price Range",     icon: Banknote },
  { key: "year",         label: "Year",            icon: CalendarDays },
  { key: "km",           label: "Kilometers",      icon: Gauge },
  { key: "specs",        label: "Regional Specs",  icon: Globe },
  { key: "body",         label: "Body Type",       icon: Shapes },
  { key: "transmission", label: "Transmission",    icon: Settings2 },
  { key: "fuel",         label: "Fuel Type",       icon: Fuel },
  { key: "color",        label: "Color",           icon: Palette },
] as const;

type SectionKey = (typeof FILTER_SECTIONS)[number]["key"];

function sectionHasValue(key: SectionKey, filters: BuyFilters): boolean {
  switch (key) {
    case "category":     return !!filters.category;
    case "city":         return !!filters.city;
    case "make":         return filters.brand !== "All" || !!filters.model;
    // case "price":        return filters.minPrice !== null || filters.maxPrice !== null;
    case "year":         return filters.minYear !== null || filters.maxYear !== null;
    case "km":           return !!filters.kmRange;
    case "specs":        return filters.specs !== "any";
    case "body":         return filters.bodyTypes.length > 0;
    case "transmission": return filters.transmission !== "any";
    case "fuel":         return filters.fuels.length > 0;
    case "color":        return filters.colors.length > 0;
  }
}

function getSectionSummary(key: SectionKey, filters: BuyFilters): string {
  switch (key) {
    case "category":     return filters.category ? CATEGORY_LABELS[filters.category] : "";
    case "city":         return filters.city;
    case "make":         {
      if (filters.brand === "All") return "";
      return filters.model ? `${filters.brand} · ${filters.model}` : filters.brand;
    }
    // case "price": { ... }
    case "year": {
      if (filters.minYear && filters.maxYear) return `${filters.minYear} – ${filters.maxYear}`;
      if (filters.minYear) return `From ${filters.minYear}`;
      if (filters.maxYear) return `Up to ${filters.maxYear}`;
      return "";
    }
    case "km":           return KM_RANGES.find(r => r.value === filters.kmRange)?.label ?? "";
    case "specs":        return REGIONAL_SPECS.find(s => s.value === filters.specs)?.label ?? "";
    case "body": {
      if (!filters.bodyTypes.length) return "";
      if (filters.bodyTypes.length === 1) return BODY_TYPE_LABELS[filters.bodyTypes[0]];
      return `${filters.bodyTypes.length} selected`;
    }
    case "transmission": return filters.transmission !== "any"
      ? (TRANSMISSION_LABELS[filters.transmission as keyof typeof TRANSMISSION_LABELS] ?? "")
      : "";
    case "fuel": {
      if (!filters.fuels.length) return "";
      if (filters.fuels.length === 1) return FUEL_LABELS[filters.fuels[0]];
      return `${filters.fuels.length} types`;
    }
    case "color": {
      if (!filters.colors.length) return "";
      if (filters.colors.length === 1) return filters.colors[0].charAt(0).toUpperCase() + filters.colors[0].slice(1);
      return `${filters.colors.length} colors`;
    }
  }
}

// ── Shared filter controls ────────────────────────────────────────────────────

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const on = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(on && opt.value !== options[0].value ? options[0].value : opt.value)}
            className={`rounded-full border px-4 py-2 font-[family-name:var(--font-body)] text-[12px] font-medium transition-all duration-200 ${
              on
                ? "border-[#2A3510] bg-[#2A3510] text-white shadow-[0_4px_12px_rgba(42,53,16,0.2)]"
                : "border-[#DDD7CE] bg-white text-[#5C5650] hover:border-[#B5A98F] hover:text-[#2A3510]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function MultiCheck<T extends string>({
  options,
  values,
  onChange,
  labelMap,
}: {
  options: T[];
  values: T[];
  onChange: (v: T[]) => void;
  labelMap: Record<T, string>;
}) {
  const set = new Set(values);
  const toggle = (v: T) => onChange(set.has(v) ? values.filter(x => x !== v) : [...values, v]);
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {options.map(opt => {
        const on = set.has(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} className="group flex items-center gap-2.5 py-2">
            <div className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${
              on ? "border-[#C9A84C] bg-[#C9A84C]" : "border-[#D5CABB] bg-white group-hover:border-[#C9A84C]/60"
            }`}>
              {on && <Check size={10} strokeWidth={3} className="text-white" />}
            </div>
            <span className={`font-[family-name:var(--font-body)] text-[13px] leading-none transition-colors ${
              on ? "text-[#2A3510] font-semibold" : "text-[#6B6560] group-hover:text-[#2A3510]"
            }`}>
              {labelMap[opt]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Flyout content per section ────────────────────────────────────────────────

function FlyoutContent({
  sectionKey,
  filters,
  onUpdate,
  mobile = false,
}: {
  sectionKey: SectionKey;
  filters: BuyFilters;
  onUpdate: (f: BuyFilters) => void;
  mobile?: boolean;
}) {
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [makeStep, setMakeStep] = useState<"brand" | "model">("brand");

  useEffect(() => {
    if (filters.brand === "All") setMakeStep("brand");
  }, [filters.brand]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  useEffect(() => {
    if (sectionKey !== "make") return;
    if (filters.brand === "All" || !filters.brand) { setModelOptions([]); return; }
    setModelsLoading(true);
    fetch(`/api/car-models?make=${encodeURIComponent(filters.brand)}`)
      .then(r => r.json())
      .then(d => setModelOptions(d.models ?? []))
      .catch(() => setModelOptions([]))
      .finally(() => setModelsLoading(false));
  }, [filters.brand, sectionKey]);

  const filteredBrands = useMemo(() => {
    const q = brandSearch.toLowerCase().trim();
    return q ? KNOWN_BRANDS.filter(b => b.toLowerCase().includes(q)) : KNOWN_BRANDS;
  }, [brandSearch]);

  const filteredModels = useMemo(() => {
    const q = modelSearch.toLowerCase().trim();
    return q ? modelOptions.filter(m => m.toLowerCase().includes(q)) : modelOptions;
  }, [modelSearch, modelOptions]);

  const inputCls = "w-full rounded-xl border border-[#DDD7CE] bg-white px-3.5 py-2.5 font-[family-name:var(--font-body)] text-[13px] text-[#2A3510] placeholder:text-[#C0BAB0] outline-none focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/10 transition-all";
  const selectCls = "flex-1 h-11 rounded-xl border border-[#DDD7CE] bg-white px-3.5 font-[family-name:var(--font-body)] text-[13px] text-[#4A453E] outline-none focus:border-[#C9A84C]/60 cursor-pointer transition-all";
  const dropdownPanelCls = "absolute top-[calc(100%+6px)] left-0 w-full rounded-2xl border border-[#E5DDD0] bg-white shadow-[0_16px_40px_rgba(42,53,16,0.12)] z-50 flex flex-col overflow-hidden";

  // Mobile accordion vs desktop flyout layout helpers
  const listCls = mobile
    ? "overflow-y-auto custom-scrollbar max-h-[260px]"
    : "flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar";
  const wrapCls = mobile
    ? "flex flex-col gap-3"
    : "flex flex-col gap-3 flex-1 min-h-0";
  const gridListCls = mobile
    ? "overflow-y-auto custom-scrollbar max-h-[260px] grid grid-cols-2 gap-x-2 gap-y-0.5"
    : "flex flex-col flex-1 min-h-0 overflow-y-auto custom-scrollbar";

  switch (sectionKey) {
    case "category": {
      const categoryOptions = [{ value: "", label: "Any" }, ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))];
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {categoryOptions.map(opt => {
            const on = (filters.category ?? "") === opt.value;
            return (
              <button key={opt.value} type="button"
                onClick={() => onUpdate({ ...filters, category: (opt.value as any) || null })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{opt.label}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );
    }

    case "city":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {["", ...UAE_CITIES].map(city => {
            const on = filters.city === city;
            return (
              <button key={city || "all"} type="button"
                onClick={() => onUpdate({ ...filters, city })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{city || "All Cities"}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "make":
      if (makeStep === "model" && filters.brand !== "All") {
        return (
          <div className={wrapCls}>
            {/* Back header */}
            <button
              type="button"
              onClick={() => { setMakeStep("brand"); setModelSearch(""); }}
              className="flex items-center gap-2 text-[#AAA49C] hover:text-[#2A3510] transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" />
              <span className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-[0.12em]">
                {filters.brand}
              </span>
            </button>
            {modelsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-4 w-4 rounded-full border-2 border-[#C9A84C] border-t-transparent animate-spin" />
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA49C] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search models…"
                    value={modelSearch}
                    onChange={e => setModelSearch(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 rounded-xl border border-[#DDD7CE] bg-white font-[family-name:var(--font-body)] text-[12px] text-[#2A3510] placeholder:text-[#C0BAB0] outline-none focus:border-[#C9A84C]/50 transition-colors"
                  />
                </div>
                <div className={gridListCls} onWheel={e => e.stopPropagation()}>
                  {!modelSearch && (
                    <button
                      type="button"
                      onClick={() => onUpdate({ ...filters, model: "" })}
                      className={`${mobile ? "col-span-2" : ""} text-left px-3 py-2 rounded-lg ${mobile ? "text-[14px]" : "text-[16px]"} font-medium transition-colors ${!filters.model ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}
                    >
                      All Models
                    </button>
                  )}
                  {filteredModels.map(model => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => onUpdate({ ...filters, model })}
                      className={`text-left px-3 py-2 rounded-lg ${mobile ? "text-[14px] truncate" : "text-[16px]"} font-medium transition-colors ${filters.model === model ? "text-[#2A3510] font-semibold bg-[#2A3510]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}
                    >
                      {model}
                    </button>
                  ))}
                  {filteredModels.length === 0 && !modelsLoading && (
                    <p className={`${mobile ? "col-span-2" : ""} py-4 text-center text-[11px] text-[#C0BAB0] uppercase tracking-wider`}>No models found</p>
                  )}
                </div>
              </>
            )}
          </div>
        );
      }

      // Step 1: brand list
      return (
        <div className={wrapCls}>
          {/* "Choose Model →" action when brand is selected */}
          {filters.brand !== "All" && (
            <button
              type="button"
              onClick={() => setMakeStep("model")}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#2A3510] text-white hover:bg-[#3A4A20] transition-colors"
            >
              <span className="font-[family-name:var(--font-body)] text-[13px] font-semibold">{filters.brand}</span>
              <div className="flex items-center gap-1 text-[#C9A84C]">
                <span className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-[0.1em]">Choose Model</span>
                <ChevronRight size={13} />
              </div>
            </button>
          )}
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA49C] pointer-events-none" />
            <input
              type="text"
              placeholder="Search makes…"
              value={brandSearch}
              onChange={e => setBrandSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-[#DDD7CE] bg-white font-[family-name:var(--font-body)] text-[12px] text-[#2A3510] placeholder:text-[#C0BAB0] outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
          </div>
          <div className={gridListCls} onWheel={e => e.stopPropagation()}>
            {!brandSearch && (
              <button
                type="button"
                onClick={() => onUpdate({ ...filters, brand: "All", model: "" })}
                className={`${mobile ? "col-span-2" : ""} text-left px-3 py-2 rounded-lg ${mobile ? "text-[14px]" : "text-[16px]"} font-medium transition-colors ${filters.brand === "All" ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}
              >
                All Makes
              </button>
            )}
            {filteredBrands.map(brand => (
              <button
                key={brand}
                type="button"
                onClick={() => { onUpdate({ ...filters, brand, model: "" }); setMakeStep("brand"); }}
                className={`text-left px-3 py-2 rounded-lg ${mobile ? "text-[14px] truncate" : "text-[16px]"} font-medium transition-colors ${filters.brand === brand ? "text-[#2A3510] font-semibold bg-[#2A3510]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}
              >
                {brand}
              </button>
            ))}
            {filteredBrands.length === 0 && (
              <p className={`${mobile ? "col-span-2" : ""} py-4 text-center text-[11px] text-[#C0BAB0] uppercase tracking-wider`}>No makes found</p>
            )}
          </div>
        </div>
      );

    /* case "price": { ... price filter commented out ... } */

    case "year": {
      const allYears = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
      const hasRange = filters.minYear !== null || filters.maxYear !== null;
      return (
        <div className={wrapCls}>
          {hasRange && (
            <div className="flex items-center justify-between px-1">
              <p className="font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510]">
                {filters.minYear ?? "Any"} – {filters.maxYear ?? "Any"}
              </p>
              <button type="button" onClick={() => onUpdate({ ...filters, minYear: null, maxYear: null })}
                className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C] hover:text-[#2A3510] transition-colors">
                Clear
              </button>
            </div>
          )}
          <div className={listCls} onWheel={e => e.stopPropagation()}>
            {allYears.map(y => {
              const isMin = filters.minYear === y;
              const isMax = filters.maxYear === y;
              const inRange = filters.minYear !== null && filters.maxYear !== null && y >= filters.minYear && y <= filters.maxYear;
              const on = isMin || isMax;
              return (
                <button key={y} type="button"
                  onClick={() => {
                    if (!filters.minYear) {
                      onUpdate({ ...filters, minYear: y });
                    } else if (!filters.maxYear) {
                      if (y < filters.minYear) onUpdate({ ...filters, minYear: y, maxYear: filters.minYear });
                      else if (y === filters.minYear) onUpdate({ ...filters, minYear: null });
                      else onUpdate({ ...filters, maxYear: y });
                    } else {
                      onUpdate({ ...filters, minYear: y, maxYear: null });
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-[16px] font-medium transition-colors ${
                    on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8"
                    : inRange ? "text-[#2A3510] bg-[#2A3510]/4"
                    : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"
                  }`}>
                  <span>{y}</span>
                  {(isMin || isMax) && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#C9A84C]">
                      {isMin && isMax ? "exact" : isMin ? "from" : "to"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {!hasRange && (
            <p className="font-[family-name:var(--font-body)] text-[10px] text-[#C0BAB0] text-center pb-1">
              Tap once for start year, twice for range
            </p>
          )}
        </div>
      );
    }

    case "km":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {KM_RANGES.map(opt => {
            const on = filters.kmRange === opt.value;
            return (
              <button key={opt.value} type="button"
                onClick={() => onUpdate({ ...filters, kmRange: opt.value })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{opt.label}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "specs":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {REGIONAL_SPECS.map(opt => {
            const on = filters.specs === opt.value;
            return (
              <button key={opt.value} type="button"
                onClick={() => onUpdate({ ...filters, specs: opt.value })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{opt.label}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "body":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {BODY_TYPES.map(opt => {
            const on = filters.bodyTypes.includes(opt);
            return (
              <button key={opt} type="button"
                onClick={() => onUpdate({ ...filters, bodyTypes: on ? filters.bodyTypes.filter(x => x !== opt) : [...filters.bodyTypes, opt] })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{BODY_TYPE_LABELS[opt]}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "transmission": {
      const transmissionOptions = [
        { value: "any", label: "Any" },
        { value: "automatic", label: "Automatic" },
        { value: "manual", label: "Manual" },
        { value: "cvt", label: "CVT" },
        { value: "amt", label: "AMT" },
      ];
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {transmissionOptions.map(opt => {
            const on = filters.transmission === opt.value;
            return (
              <button key={opt.value} type="button"
                onClick={() => onUpdate({ ...filters, transmission: opt.value as BuyFilters["transmission"] })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{opt.label}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );
    }

    case "fuel":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {(Object.entries(FUEL_LABELS) as [keyof typeof FUEL_LABELS, string][]).map(([val, label]) => {
            const on = filters.fuels.includes(val);
            return (
              <button key={val} type="button"
                onClick={() => onUpdate({ ...filters, fuels: on ? filters.fuels.filter(x => x !== val) : [...filters.fuels, val] })}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[16px] font-medium transition-colors ${on ? "text-[#C9A84C] font-semibold bg-[#C9A84C]/8" : "text-[#4A453E] hover:bg-[#F5F2EC] hover:text-[#2A3510]"}`}>
                <span>{label}</span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0" />}
              </button>
            );
          })}
        </div>
      );

    case "color":
      return (
        <div className={listCls} onWheel={e => e.stopPropagation()}>
          {COLOR_OPTIONS.map(c => {
            const on = filters.colors.includes(c.value);
            const lightColor = c.value === "white" || c.value === "beige" || c.value === "silver" || c.value === "yellow";
            return (
              <button key={c.value} type="button"
                onClick={() => onUpdate({ ...filters, colors: on ? filters.colors.filter(x => x !== c.value) : [...filters.colors, c.value] })}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${on ? "bg-[#2A3510]/6" : "hover:bg-[#F5F2EC]"}`}>
                {/* Gradient color ball */}
                <div
                  className={`relative shrink-0 w-6 h-6 rounded-full transition-all duration-200 ${c.border ? "ring-1 ring-[#DDD7CE]" : ""} ${on ? "ring-2 ring-[#C9A84C] ring-offset-1 ring-offset-white scale-110" : ""}`}
                  style={{
                    background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 55%, rgba(0,0,0,0.18) 100%), ${c.hex}`,
                    boxShadow: on ? `0 0 8px ${c.hex}88` : `0 1px 4px ${c.hex}55`,
                  }}
                >
                  {on && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full">
                      <Check size={10} strokeWidth={3} className={lightColor ? "text-[#2A3510]" : "text-white"} />
                    </div>
                  )}
                </div>
                <span className={`font-[family-name:var(--font-body)] text-[16px] font-medium transition-colors ${on ? "text-[#2A3510] font-semibold" : "text-[#4A453E]"}`}>
                  {c.label}
                </span>
                {on && <Check size={18} className="text-[#C9A84C] shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>
      );
  }
}

// ── Desktop filter rail ───────────────────────────────────────────────────────

function FilterRail({
  filters,
  activeSection,
  onHoverSection,
  onReset,
}: {
  filters: BuyFilters;
  activeSection: SectionKey | null;
  onHoverSection: (key: SectionKey) => void;
  onReset: () => void;
}) {
  const totalActive = FILTER_SECTIONS.filter(s => sectionHasValue(s.key, filters)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Rail header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE6DF]">
        <p className="font-[family-name:var(--font-display)] text-[19px] font-semibold text-[#2A3510] leading-tight">
          Filters
        </p>
        {totalActive > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="group flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B0A898] hover:text-[#2A3510] transition-colors"
          >
            <RotateCcw size={10} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
            Reset
          </button>
        )}
      </div>

      {/* Section items */}
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar flex flex-col gap-1">
        {FILTER_SECTIONS.map(({ key, label, icon: Icon }) => {
          const hasValue = sectionHasValue(key, filters);
          const summary = getSectionSummary(key, filters);
          const isActive = activeSection === key;

          return (
            <button
              key={key}
              type="button"
              onMouseEnter={() => onHoverSection(key)}
              className={`group relative flex w-full items-center gap-4 px-4 py-2.5 text-left transition-all duration-150 ${
                isActive ? "bg-white" : "hover:bg-[#F7F4EF]"
              }`}
            >
              {/* Gold left accent line when active */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#C9A84C]" />
              )}

              {/* Icon — no bg */}
              <Icon size={18} className={`shrink-0 transition-colors duration-150 ${
                isActive ? "text-[#C9A84C]" :
                hasValue ? "text-[#C9A84C]" :
                "text-[#9A9488] group-hover:text-[#2A3510]"
              }`} />

              {/* Label + summary */}
              <div className="flex-1 min-w-0">
                <p className={`font-[family-name:var(--font-display)] text-[16px] font-semibold leading-tight transition-colors ${
                  isActive ? "text-[#2A3510]" : "text-[#3A3530] group-hover:text-[#2A3510]"
                }`}>
                  {label}
                </p>
                {hasValue && summary && (
                  <p className="font-[family-name:var(--font-body)] text-[11px] text-[#C9A84C] font-medium mt-0.5 truncate">
                    {summary}
                  </p>
                )}
              </div>

              {/* Right chevron */}
              <ChevronRight size={13} className={`shrink-0 transition-all duration-150 ${
                isActive ? "text-[#C9A84C]" : "text-[#C5BEB4] group-hover:text-[#8C877F] group-hover:translate-x-0.5"
              }`} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Desktop flyout panel ──────────────────────────────────────────────────────

function FilterFlyout({
  activeSection,
  filters,
  onUpdate,
  onMouseEnter,
  onMouseLeave,
  railWidth,
  isClosing,
}: {
  activeSection: SectionKey;
  filters: BuyFilters;
  onUpdate: (f: BuyFilters) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  railWidth: number;
  isClosing?: boolean;
}) {
  const section = FILTER_SECTIONS.find(s => s.key === activeSection)!;
  const hasValue = sectionHasValue(activeSection, filters);

  const clearSection = () => {
    switch (activeSection) {
      case "category":     onUpdate({ ...filters, category: null }); break;
      case "city":         onUpdate({ ...filters, city: "" }); break;
      case "make":         onUpdate({ ...filters, brand: "All", model: "" }); break;
      // case "price":        onUpdate({ ...filters, minPrice: null, maxPrice: null }); break;
      case "year":         onUpdate({ ...filters, minYear: null, maxYear: null }); break;
      case "km":           onUpdate({ ...filters, kmRange: "" }); break;
      case "specs":        onUpdate({ ...filters, specs: "any" }); break;
      case "body":         onUpdate({ ...filters, bodyTypes: [] }); break;
      case "transmission": onUpdate({ ...filters, transmission: "any" }); break;
      case "fuel":         onUpdate({ ...filters, fuels: [] }); break;
      case "color":        onUpdate({ ...filters, colors: [] }); break;
    }
  };

  return (
    <div
      className={`fixed top-[72px] h-[calc(100vh-72px)] flex flex-col overflow-hidden bg-white border-r border-[#E5DDD0] z-[29] duration-150 ${
        isClosing
          ? "animate-out slide-out-to-left-2 fade-out"
          : "animate-in slide-in-from-left-2 fade-in"
      }`}
      style={{ left: railWidth, width: 280, boxShadow: "4px 0 24px rgba(42,53,16,0.08)" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Flyout header */}
      <div className="sticky top-0 bg-white border-b border-[#EAE6DF] px-5 py-4 z-10">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-[19px] font-semibold text-[#2A3510] leading-tight">
            {section.label}
          </p>
          {hasValue && (
            <button
              type="button"
              onClick={clearSection}
              className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C] hover:text-[#2A3510] transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Flyout controls */}
      <div className="p-5 flex flex-col flex-1 min-h-0">
        <FlyoutContent
          sectionKey={activeSection}
          filters={filters}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

// ── Mobile filters (collapsible sheet) ───────────────────────────────────────

function MobileFilters({
  filters,
  onUpdate,
  onReset,
}: {
  filters: BuyFilters;
  onUpdate: (f: BuyFilters) => void;
  onReset: () => void;
}) {
  const [openSection, setOpenSection] = useState<SectionKey | null>("category");

  return (
    <div>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#EAE6DF]">
        <p className="font-[family-name:var(--font-display)] text-[16px] font-semibold text-[#2A3510]">Filters</p>
        <button type="button" onClick={onReset} className="font-[family-name:var(--font-body)] text-[11px] font-semibold text-[#AAA49C] hover:text-[#2A3510] transition-colors flex items-center gap-1.5">
          <RotateCcw size={11} /> Reset all
        </button>
      </div>
      {FILTER_SECTIONS.map(({ key, label, icon: Icon }) => {
        const hasValue = sectionHasValue(key, filters);
        const summary = getSectionSummary(key, filters);
        const isOpen = openSection === key;
        return (
          <div key={key} className="border-b border-[#EAE6DF] last:border-b-0">
            <button
              type="button"
              onClick={() => setOpenSection(isOpen ? null : key)}
              className="group flex w-full items-center gap-3 py-3.5 text-left"
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${isOpen ? "bg-[#2A3510]" : hasValue ? "bg-[#C9A84C]/12" : "bg-[#F0ECE6]"}`}>
                <Icon size={13} className={isOpen ? "text-white" : hasValue ? "text-[#C9A84C]" : "text-[#7A7268]"} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`block font-[family-name:var(--font-display)] text-[14px] font-semibold leading-tight ${hasValue || isOpen ? "text-[#2A3510]" : "text-[#4A453E]"}`}>{label}</span>
                {hasValue && summary && !isOpen && (
                  <span className="block font-[family-name:var(--font-body)] text-[11px] text-[#C9A84C] font-medium mt-0.5 truncate">{summary}</span>
                )}
              </div>
              <ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#C9A84C]" : "text-[#C5BEB4]"}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[320px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="pb-4">
                <FlyoutContent sectionKey={key} filters={filters} onUpdate={onUpdate} mobile />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CarCard ───────────────────────────────────────────────────────────────────

const BUBBLE_ANGLES = [0, 60, 120, 180, 240, 300];

function CarCard({ car, searchQuery }: { car: Car; searchQuery?: string }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const imageUrl = car.images[0] ?? null;
  const condition = deriveCondition(car.km_driven);
  const kmLabel = car.km_driven === 0 ? "Brand New" : `${car.km_driven.toLocaleString()} km`;

  const handleCardClick = () => {
    if (searchQuery?.trim()) {
      fetch("/api/buy/search-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      }).catch(() => {});
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) { setBurst(true); setPopKey(v => v + 1); window.setTimeout(() => setBurst(false), 600); }
    setLiked(v => !v);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-sovereign-navy/10 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <Link href={`/buy/${car.slug}`} className="flex h-full flex-col" onClick={handleCardClick}>
        <div className="relative aspect-video shrink-0 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={car.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-cream">
              <span className="font-[family-name:var(--font-body)] text-[12px] text-stone-grey">No image available</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-surface-cream px-3 py-1.5 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold text-sovereign-navy uppercase tracking-wider">
              {condition === "New" ? "Brand New" : condition === "Used" ? "Pre-Owned" : "Certified Pre-Owned"}
            </span>
          </div>
        </div>
        <div className="flex flex-grow flex-col p-4 sm:p-5">
          <div className="mb-0.5">
            <span className="font-[family-name:var(--font-body)] text-[10px] font-bold text-stone-grey uppercase tracking-[0.08em]">{car.year} {car.brand}</span>
          </div>
          <h3 className="line-clamp-1 font-[family-name:var(--font-display)] text-[17px] font-bold text-sovereign-navy mb-2 leading-tight">{car.title}</h3>
          <div className="grid grid-cols-3 gap-1 py-2.5 border-y border-sovereign-navy/5 bg-surface-cream/50 rounded-lg mb-3">
            <div className="flex flex-col items-center border-r border-outline-variant/30 px-1">
              <Gauge size={16} className="text-stone-grey mb-1" />
              <span className="font-[family-name:var(--font-body)] text-[10px] text-sovereign-navy font-semibold text-center leading-none">{kmLabel}</span>
            </div>
            <div className="flex flex-col items-center border-r border-outline-variant/30 px-1">
              <Fuel size={16} className="text-stone-grey mb-1" />
              <span className="font-[family-name:var(--font-body)] text-[10px] text-sovereign-navy font-semibold text-center leading-none">{FUEL_LABELS[car.fuel_type]}</span>
            </div>
            <div className="flex flex-col items-center px-1">
              <Settings2 size={16} className="text-stone-grey mb-1" />
              <span className="font-[family-name:var(--font-body)] text-[10px] text-sovereign-navy font-semibold text-center leading-none">{TRANSMISSION_LABELS[car.transmission]}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-stone-grey" />
              <span className="font-[family-name:var(--font-body)] text-[12px] text-stone-grey">{car.location}</span>
            </div>
            <div className="font-[family-name:var(--font-body)] text-[11px] text-stone-grey italic">
              {car.category ? `${CATEGORY_LABELS[car.category]} · ` : ""}{BODY_TYPE_LABELS[car.type]}
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center">
            <span className="bg-emirate-teal/10 px-2 py-0.5 rounded text-[9px] font-bold text-emirate-teal uppercase tracking-tighter">READY TO DRIVE</span>
            <div className="bg-prestige-gold hover:bg-prestige-gold/90 text-sovereign-navy px-4 py-2 rounded-full flex items-center gap-1.5 transition-all duration-300 group shadow-sm active:scale-95">
              <span className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase">View Details</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 z-20">
        <button type="button" onClick={handleLike} aria-label="Save to favourites" className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform overflow-visible">
          {burst && BUBBLE_ANGLES.map((angle, i) => (
            <span key={angle} className="heart-bubble" style={{ "--angle": `${angle}deg`, width: i % 2 === 0 ? 5 : 4, height: i % 2 === 0 ? 5 : 4, animationDelay: `${i * 20}ms`, backgroundColor: "#C9A84C" } as React.CSSProperties} />
          ))}
          <Heart key={popKey} size={20} strokeWidth={2} className={`relative z-10 transition-colors duration-200 ${liked ? "fill-prestige-gold text-prestige-gold heart-pop" : "text-stone-grey"}`} />
        </button>
      </div>
    </article>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function BuyClient({
  cars,
  otherCars = [],
  brands,
  filters,
}: {
  cars: Car[];
  otherCars?: Car[];
  brands: string[];
  filters: BuyFilters;
}) {
  return (
    <BuyClientView
      cars={cars}
      otherCars={otherCars}
      brands={brands}
      filters={filters}
    />
  );
}

const RAIL_WIDTH = 280;

function BuyClientView({
  cars,
  otherCars = [],
  brands,
  filters,
}: {
  cars: Car[];
  otherCars?: Car[];
  brands: string[];
  filters: BuyFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const dragStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalFilters(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  // Flyout hover state
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [flyoutClosing, setFlyoutClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openFlyout = (key: SectionKey) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
    setFlyoutClosing(false);
    setActiveSection(key);
  };

  const scheduleFlyoutClose = () => {
    closeTimerRef.current = setTimeout(() => {
      setFlyoutClosing(true);
      closingTimerRef.current = setTimeout(() => {
        setActiveSection(null);
        setFlyoutClosing(false);
      }, 150);
    }, 220);
  };

  const cancelFlyoutClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
    setFlyoutClosing(false);
  };

  const activeFilters = useMemo(() => {
    const items: Array<{ key: ActiveFilterKey; value?: string; label: string }> = [];
    if (localFilters.q) items.push({ key: "q", label: formatActiveLabel(localFilters, "q") });
    if (localFilters.brand !== "All") items.push({ key: "brand", label: formatActiveLabel(localFilters, "brand") });
    if (localFilters.model) items.push({ key: "model", label: localFilters.model });
    if (localFilters.city) items.push({ key: "city", label: localFilters.city });
    if (localFilters.transmission !== "any") items.push({ key: "transmission", label: formatActiveLabel(localFilters, "transmission") });
    if (localFilters.kmRange) items.push({ key: "kmRange", label: formatActiveLabel(localFilters, "kmRange") });
    if (localFilters.specs !== "any") items.push({ key: "specs", label: formatActiveLabel(localFilters, "specs") });
    if (localFilters.category) items.push({ key: "category", label: formatActiveLabel(localFilters, "category") });
    if (localFilters.minPrice !== null || localFilters.maxPrice !== null) items.push({ key: "priceRange", label: formatActiveLabel(localFilters, "priceRange") });
    if (localFilters.minYear !== null || localFilters.maxYear !== null) items.push({ key: "yearRange", label: formatActiveLabel(localFilters, "yearRange") });
    for (const bt of localFilters.bodyTypes) items.push({ key: "bodyType", value: bt, label: formatActiveLabel(localFilters, "bodyType", bt) });
    for (const f of localFilters.fuels) items.push({ key: "fuel", value: f, label: formatActiveLabel(localFilters, "fuel", f) });
    for (const c of localFilters.colors) items.push({ key: "color", value: c, label: formatActiveLabel(localFilters, "color", c) });
    return items;
  }, [localFilters]);

  const applyFilters = (next: BuyFilters) => {
    setLocalFilters(next);
    const params = createSearchParams(next);
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    startTransition(() => { router.replace(target, { scroll: false }); window.scrollTo({ top: 0, behavior: "smooth" }); });
  };

  const resetAll = () => applyFilters(DEFAULT_BUY_FILTERS);

  const removeFilter = (key: ActiveFilterKey, value?: string) => {
    switch (key) {
      case "q":           return applyFilters({ ...localFilters, q: "" });
      case "brand":       return applyFilters({ ...localFilters, brand: "All", model: "" });
      case "model":       return applyFilters({ ...localFilters, model: "" });
      case "city":        return applyFilters({ ...localFilters, city: "" });
      case "transmission": return applyFilters({ ...localFilters, transmission: "any" });
      case "kmRange":     return applyFilters({ ...localFilters, kmRange: "" });
      case "specs":       return applyFilters({ ...localFilters, specs: "any" });
      case "category":    return applyFilters({ ...localFilters, category: null });
      case "priceRange":  return applyFilters({ ...localFilters, minPrice: null, maxPrice: null });
      case "yearRange":   return applyFilters({ ...localFilters, minYear: null, maxYear: null });
      case "bodyType":    return value && applyFilters({ ...localFilters, bodyTypes: localFilters.bodyTypes.filter(x => x !== value) });
      case "fuel":        return value && applyFilters({ ...localFilters, fuels: localFilters.fuels.filter(x => x !== value) });
      case "color":       return value && applyFilters({ ...localFilters, colors: localFilters.colors.filter(x => x !== value) });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6]">

      {/* Desktop rail sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-[72px] h-[calc(100vh-72px)] shrink-0 bg-[#FBF8F2] border-r border-[#E5DDD0] z-30 overflow-y-auto custom-scrollbar"
        style={{ width: RAIL_WIDTH }}
        onMouseLeave={scheduleFlyoutClose}
        onWheel={e => e.stopPropagation()}
      >
        <FilterRail
          filters={localFilters}
          activeSection={activeSection}
          onHoverSection={openFlyout}
          onReset={resetAll}
        />
      </aside>

      {/* Desktop flyout panel */}
      {activeSection && (
        <div className="hidden lg:block">
          <FilterFlyout
            activeSection={activeSection}
            filters={localFilters}
            onUpdate={applyFilters}
            onMouseEnter={cancelFlyoutClose}
            onMouseLeave={scheduleFlyoutClose}
            railWidth={RAIL_WIDTH}
            isClosing={flyoutClosing}
          />
        </div>
      )}

      <main className="min-w-0 bg-[#FCFAF6] pb-12 lg:ml-[280px]">
        <div className="mx-auto w-full max-w-[1120px] px-6 py-6 lg:px-8 lg:py-8">

            {/* Mobile filter button */}
          <div className="mb-5 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-4 font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510] shadow-[0_4px_12px_rgba(42,53,16,0.06)] hover:border-[#A59568] transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilters.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A84C] font-[family-name:var(--font-body)] text-[9px] font-bold text-white">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

            {/* Results */}
            <div className="relative">
              {isPending && (
                <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 bg-[#FCFAF6]/50 backdrop-blur-[1px] rounded-2xl">
                  <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E7DEC9] animate-in fade-in zoom-in-95 slide-in-from-top-4">
                    <div className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                    <span className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">Updating results…</span>
                  </div>
                </div>
              )}
              {cars.length > 0 ? (
                <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5 transition-all duration-500 ${isPending ? "opacity-30 blur-[2px]" : ""}`}>
                  {cars.map(car => <CarCard key={car.id} car={car} searchQuery={localFilters.q} />)}
                </div>
              ) : (
                !isPending && <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#2A3510]/30 text-center mb-2">No exact matches found</p>
              )}
              {otherCars.length > 0 && (
                <div className={`${cars.length === 0 ? "mt-4" : "mt-16"} transition-all duration-500 ${isPending ? "opacity-30 blur-[2px]" : ""}`}>
                  <div className="relative flex items-center justify-center mb-10">
                    <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CDBFA8] to-transparent" />
                    <div className="relative bg-[#FCFAF6] px-6">
                      <h2 className="font-[family-name:var(--font-display)] text-[11px] sm:text-[16px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[#3A4A20]">Explore other premium listings</h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                    {otherCars.map(car => <CarCard key={car.id} car={car} searchQuery={localFilters.q} />)}
                  </div>
                </div>
              )}
            </div>
        </div>
      </main>


      {/* Mobile filter overlay */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => { setIsMobileFiltersOpen(false); setSheetDragY(0); }}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[90vh] flex flex-col rounded-t-[28px] bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
            style={{
              transform: `translateY(${sheetDragY}px)`,
              transition: dragStartYRef.current === null ? "transform 0.25s ease" : "none",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle + close button */}
            <div
              className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
              onTouchStart={e => { dragStartYRef.current = e.touches[0].clientY; }}
              onTouchMove={e => {
                if (dragStartYRef.current === null) return;
                const delta = e.touches[0].clientY - dragStartYRef.current;
                if (delta > 0) setSheetDragY(delta);
              }}
              onTouchEnd={() => {
                if (sheetDragY > 80) {
                  setIsMobileFiltersOpen(false);
                }
                setSheetDragY(0);
                dragStartYRef.current = null;
              }}
            >
              <div className="h-1 w-12 rounded-full bg-[#DDD7CE]" />
              <button
                type="button"
                onClick={() => { setIsMobileFiltersOpen(false); setSheetDragY(0); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0ECE6] text-[#6B6560] hover:bg-[#E5DDD0] transition-colors"
                aria-label="Close filters"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto custom-scrollbar px-5 pb-8">
              <MobileFilters filters={localFilters} onUpdate={applyFilters} onReset={resetAll} />
              <button
                type="button"
                onClick={() => { setIsMobileFiltersOpen(false); setSheetDragY(0); }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#2A3510] px-5 py-3.5 font-[family-name:var(--font-body)] text-[12px] font-bold uppercase tracking-[0.2em] text-white hover:bg-[#3A4A20] transition-colors active:scale-[0.98]"
              >
                Show {cars.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
