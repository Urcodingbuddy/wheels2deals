"use client";

import { useMemo, useState, useTransition, useRef, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  Search,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { FooterSection } from "@/components/landing/FooterSection";
import { usePathname, useRouter } from "next/navigation";
import type { Tables } from "@/types/database";
import {
  BODY_TYPES,
  BODY_TYPE_LABELS,
  CONDITION_STYLE,
  DEFAULT_BUY_FILTERS,
  FUEL_LABELS,
  SORT_OPTIONS,
  TRANSMISSION_LABELS,
  deriveCondition,
  type BuyFilters,
  type Condition,
  CATEGORY_LABELS,
} from "./filters";
import { KNOWN_BRANDS } from "./search";

type Car = Tables<"cars">;

function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatActiveLabel(filters: BuyFilters, key: ActiveFilterKey) {
  switch (key) {
    case "condition":
      return filters.condition;
    case "brand":
      return filters.brand;
    case "transmission":
      return filters.transmission === "any"
        ? "Any Transmission"
        : TRANSMISSION_LABELS[filters.transmission];
    case "q":
      return `Search: ${filters.q}`;
    case "bodyType":
      return "Body Type";
    case "fuel":
      return "Fuel Type";
    case "category":
      return filters.category ? CATEGORY_LABELS[filters.category] : "";
    default:
      return key;
  }
}

function createSearchParams(filters: BuyFilters) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.condition !== DEFAULT_BUY_FILTERS.condition) {
    params.set("condition", filters.condition);
  }
  if (filters.brand !== DEFAULT_BUY_FILTERS.brand) {
    params.set("brand", filters.brand);
  }
  if (filters.transmission !== DEFAULT_BUY_FILTERS.transmission) {
    params.set("transmission", filters.transmission);
  }
  if (filters.sort !== DEFAULT_BUY_FILTERS.sort) {
    params.set("sort", filters.sort);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }

  for (const type of filters.bodyTypes) {
    params.append("type", type);
  }

  for (const fuel of filters.fuels) {
    params.append("fuel", fuel);
  }

  return params;
}

type ActiveFilterKey =
  | "q"
  | "condition"
  | "brand"
  | "transmission"
  | "bodyType"
  | "fuel"
  | "category";

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#E7E1D7] py-5 first:border-t-0 first:pt-0">
      <button
        type="button"
        className="mb-3 flex w-full items-center justify-between bg-transparent p-0 text-left"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7C7A73]">
          {title}
        </span>
        {open ? (
          <ChevronUp size={15} className="shrink-0 text-[#9B958B]" />
        ) : (
          <ChevronDown size={15} className="shrink-0 text-[#9B958B]" />
        )}
      </button>
      {open && children}
    </div>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(value === option.value ? "" : option.value)}
            className={`rounded-full border px-3.5 py-2 font-[family-name:var(--font-body)] text-[11px] font-medium transition-all duration-200 ${
              selected
                ? "border-[#2A3510] bg-[#2A3510] text-white shadow-[0_10px_24px_rgba(42,53,16,0.2)]"
                : "border-[#C7BCA9] bg-[#FFFEFB] text-[#4E493F] hover:border-[#8D7A45] hover:text-[#2A3510]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxGroup<T extends string>({
  options,
  values,
  onChange,
  labelMap,
}: {
  options: T[];
  values: T[];
  onChange: (values: T[]) => void;
  labelMap: Record<T, string>;
}) {
  const selectedValues = new Set(values);

  const toggle = (value: T) => {
    if (selectedValues.has(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }

    onChange([...values, value]);
  };

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {options.map((option) => {
        const selected = selectedValues.has(option);

        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className="flex items-center gap-3 w-full py-2 group transition-all"
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                selected
                  ? "border-[#C9A84C] bg-[#C9A84C] shadow-[0_0_12px_rgba(201,168,76,0.3)]"
                  : "border-[#D5CAB7] bg-white group-hover:border-[#C9A84C]/50"
              }`}
            >
              {selected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1.5 4L4 6.5L8.5 1.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={`font-[family-name:var(--font-body)] text-[14px] transition-colors ${
              selected ? "text-[#2A3510] font-semibold" : "text-[#2A3510]/70 group-hover:text-[#2A3510]"
            }`}>
              {labelMap[option]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const BUBBLE_ANGLES = [0, 60, 120, 180, 240, 300];

function CarCard({ car }: { car: Car }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const imageUrl = car.images[0] ?? null;
  const condition = deriveCondition(car.km_driven);
  const kmLabel =
    car.km_driven === 0 ? "Brand New" : `${car.km_driven.toLocaleString()} km`;

  const handleLike = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!liked) {
      setBurst(true);
      setPopKey((value) => value + 1);
      window.setTimeout(() => setBurst(false), 600);
    }

    setLiked((value) => !value);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#DED6C8] bg-[linear-gradient(180deg,#FFFDF9_0%,#F8F5EE_100%)] shadow-[0_10px_24px_rgba(42,53,16,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(42,53,16,0.12)]">
      <Link href={`/buy/${car.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-[#ECE8DF]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={car.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-[family-name:var(--font-body)] text-[12px] text-[#9F998E]">
                No image available
              </span>
            </div>
          )}

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 pr-16">
            <span
              className={`rounded-full px-3 py-1 font-[family-name:var(--font-body)] text-[9px] font-bold uppercase tracking-[0.16em] shadow-sm ${CONDITION_STYLE[condition]}`}
            >
              {condition}
            </span>
          </div>
        </div>

        <div className="flex flex-grow flex-col space-y-4 px-4 pb-4 pt-3.5 sm:px-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F674F]">
                {car.brand}
              </p>
              <span className="inline-flex items-center rounded-full bg-[#3A4A20]/5 px-2 py-0.5 font-[family-name:var(--font-body)] text-[9px] font-bold uppercase tracking-[0.15em] text-[#3A4A20] whitespace-nowrap">
                Ready to drive
              </span>
            </div>
            
            <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-tight tracking-[-0.02em] text-[#223006]">
              {car.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EBE1] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#4F493F]">
              <Gauge size={12} strokeWidth={1.8} className="text-[#3A4A20]" />
              {kmLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EBE1] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#4F493F]">
              <Fuel size={12} strokeWidth={1.8} className="text-[#3A4A20]" />
              {FUEL_LABELS[car.fuel_type]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EBE1] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#4F493F]">
              <Settings2
                size={12}
                strokeWidth={1.8}
                className="text-[#3A4A20]"
              />
              {TRANSMISSION_LABELS[car.transmission]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EBE1] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#4F493F]">
              <MapPin size={12} strokeWidth={1.8} className="text-[#3A4A20]" />
              {car.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EBE1] px-2.5 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#4F493F]">
              <CalendarDays size={12} strokeWidth={1.8} className="text-[#3A4A20]" />
              {car.year}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between rounded-[16px] border border-[#DCD2C2] bg-white/90 px-3.5 py-2.5">
            <div>
              <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F674F]">
                {car.category ? `${CATEGORY_LABELS[car.category]} • ` : ""} {BODY_TYPE_LABELS[car.type]}
              </p>
              <p className="mt-1 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#223006]">
                Ready to drive
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-[#2A3510] px-4 py-2 transition-all duration-300 group-hover:bg-[#C9A84C] group-hover:shadow-[0_4px_12px_rgba(201,168,76,0.3)] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
              <span className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
                View Details
              </span>
              <ArrowRight size={13} className="text-white transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={handleLike}
          aria-label="Save to favourites"
          className="relative rounded-full border border-white/70 bg-[#2A3510]/90 p-2 shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-sm"
        >
          {burst &&
            BUBBLE_ANGLES.map((angle, index) => (
              <span
                key={angle}
                className="heart-bubble"
                style={
                  {
                    "--angle": `${angle}deg`,
                    width: index % 2 === 0 ? 5 : 4,
                    height: index % 2 === 0 ? 5 : 4,
                    animationDelay: `${index * 20}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          <Heart
            key={popKey}
            size={18}
            strokeWidth={1.8}
            className={`relative z-10 transition-colors duration-200 ${
              liked ? "fill-[#C9A84C] text-[#C9A84C] heart-pop" : "text-white"
            }`}
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
          />
        </button>
      </div>
    </article>
  );
}

function FiltersPanel({
  filters,
  onUpdate,
  onReset,
  isMobile = false,
}: {
  filters: BuyFilters;
  onUpdate: (nextFilters: BuyFilters) => void;
  onReset: () => void;
  isMobile?: boolean;
}) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const filteredBrands = useMemo(() => {
    const search = brandSearch.toLowerCase().trim();
    if (!search) return KNOWN_BRANDS;
    return KNOWN_BRANDS.filter(brand => 
      brand.toLowerCase().includes(search)
    );
  }, [brandSearch]);

  const conditionOptions = [
    { value: "Any", label: "Any" },
    { value: "New", label: "New" },
    { value: "Certified", label: "Certified" },
    { value: "Used", label: "Used" },
  ];

  const transmissionOptions = [
    { value: "any", label: "Any" },
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
    { value: "cvt", label: "CVT" },
    { value: "amt", label: "AMT" },
  ];

  return (
    <div className={isMobile ? "" : "py-2"}>
      {!isMobile && (
        <div className="flex items-center justify-start pb-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#BFAF97] bg-[#FFFEFB] px-4 py-2 font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#4D473E] transition-all hover:border-[#2A3510] hover:text-[#2A3510] hover:shadow-sm"
          >
            Reset Filters <X size={13} />
          </button>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7C7A73]">
          Car Category
        </p>
        <ToggleGroup
          options={[
            { value: "", label: "Any" },
            ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
          ]}
          value={filters.category ?? ""}
          onChange={(category) =>
            onUpdate({
              ...filters,
              category: (category as any) || null,
            })
          }
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7C7A73]">
          Condition
        </p>
        <ToggleGroup
          options={conditionOptions}
          value={filters.condition}
          onChange={(condition) =>
            onUpdate({
              ...filters,
              condition: condition as Condition,
            })
          }
        />
      </div>

      <div className="mt-2">
        <CollapsibleSection title="Car Brand" defaultOpen={true}>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setBrandDropdownOpen(!brandDropdownOpen);
                setBrandSearch("");
              }}
              className="flex h-12 w-full items-center justify-between rounded-full border border-[#CDBFA8] bg-[#FFFEFB] px-4 font-[family-name:var(--font-body)] text-[12px] font-medium text-[#2A3510] shadow-[0_8px_18px_rgba(42,53,16,0.06)] outline-none transition-colors hover:border-[#9E884E] focus:border-[#8D7A45]"
            >
              <span className="truncate pr-4">
                {filters.brand === "All" ? "All brands" : filters.brand}
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-[#6C675F] transition-transform duration-300 ${brandDropdownOpen ? 'rotate-180 text-[#C9A84C]' : ''}`}
              />
            </button>

            {brandDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setBrandDropdownOpen(false)} 
                />
                <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-[#2A3510]/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#2A3510]/5 bg-[#FBF8F2]">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A846F]" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search brands..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 rounded-xl border border-[#DED6C8] bg-white font-[family-name:var(--font-body)] text-[12px] focus:border-[#C9A84C] outline-none transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  
                <div 
                  className="max-h-[220px] overflow-y-auto overscroll-contain flex flex-col py-1 no-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
                    {!brandSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdate({ ...filters, brand: "All" });
                          setBrandDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#F1F3E1] ${filters.brand === "All" ? 'text-[#C9A84C] bg-[#C9A84C]/5' : 'text-[#2A3510]'}`}
                      >
                        All brands
                      </button>
                    )}
                    
                    {filteredBrands.map(brand => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          onUpdate({ ...filters, brand });
                          setBrandDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#F1F3E1] ${filters.brand === brand ? 'text-[#C9A84C] bg-[#C9A84C]/5' : 'text-[#2A3510]'}`}
                      >
                        {brand}
                      </button>
                    ))}

                    {filteredBrands.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <p className="text-[11px] font-medium text-[#8A846F] uppercase tracking-wider">No brands found</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Body Type">
          <CheckboxGroup
            options={BODY_TYPES}
            values={filters.bodyTypes}
            onChange={(bodyTypes) => onUpdate({ ...filters, bodyTypes })}
            labelMap={BODY_TYPE_LABELS}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Transmission">
          <ToggleGroup
            options={transmissionOptions}
            value={filters.transmission}
            onChange={(transmission) =>
              onUpdate({
                ...filters,
                transmission: transmission as BuyFilters["transmission"],
              })
            }
          />
        </CollapsibleSection>

        <CollapsibleSection title="Fuel Type">
          <CheckboxGroup
            options={Object.keys(FUEL_LABELS) as Array<keyof typeof FUEL_LABELS>}
            values={filters.fuels}
            onChange={(fuels) => onUpdate({ ...filters, fuels })}
            labelMap={FUEL_LABELS}
          />
        </CollapsibleSection>
      </div>
    </div>
  );
}

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
      key={JSON.stringify(filters)}
      cars={cars}
      otherCars={otherCars}
      brands={brands}
      filters={filters}
    />
  );
}

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

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Always prevent the page from scrolling while cursor is over the sidebar
      e.stopPropagation();
      e.preventDefault();

      // Manually scroll the sidebar instead
      el.scrollTop += e.deltaY;
    };

    // passive: false is REQUIRED to allow preventDefault()
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const activeFilters = useMemo(() => {
    const items: Array<{
      key: ActiveFilterKey;
      value?: string;
      label: string;
    }> = [];

    if (localFilters.q) {
      items.push({ key: "q", label: formatActiveLabel(localFilters, "q") });
    }

    if (localFilters.condition !== "Any") {
      items.push({
        key: "condition",
        label: formatActiveLabel(localFilters, "condition"),
      });
    }

    if (localFilters.brand !== "All") {
      items.push({
        key: "brand",
        label: formatActiveLabel(localFilters, "brand"),
      });
    }

    if (localFilters.transmission !== "any") {
      items.push({
        key: "transmission",
        label: formatActiveLabel(localFilters, "transmission"),
      });
    }

    for (const bodyType of localFilters.bodyTypes) {
      items.push({
        key: "bodyType",
        value: bodyType,
        label: BODY_TYPE_LABELS[bodyType],
      });
    }

    for (const fuel of localFilters.fuels) {
      items.push({
        key: "fuel",
        value: fuel,
        label: FUEL_LABELS[fuel],
      });
    }

    if (localFilters.category) {
      items.push({
        key: "category",
        label: formatActiveLabel(localFilters, "category"),
      });
    }

    return items;
  }, [localFilters]);

  const applyFilters = (nextFilters: BuyFilters) => {
    setLocalFilters(nextFilters);

    const params = createSearchParams(nextFilters);
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(target, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const resetAll = () => {
    applyFilters(DEFAULT_BUY_FILTERS);
  };

  const removeFilter = (key: ActiveFilterKey, value?: string) => {
    if (key === "q") {
      applyFilters({ ...localFilters, q: "" });
      return;
    }

    if (key === "condition") {
      applyFilters({ ...localFilters, condition: "Any" });
      return;
    }

    if (key === "brand") {
      applyFilters({ ...localFilters, brand: "All" });
      return;
    }

    if (key === "transmission") {
      applyFilters({ ...localFilters, transmission: "any" });
      return;
    }

    if (key === "bodyType" && value) {
      applyFilters({
        ...localFilters,
        bodyTypes: localFilters.bodyTypes.filter((item) => (item as string) !== value),
      });
      return;
    }

    if (key === "fuel" && value) {
      applyFilters({
        ...localFilters,
        fuels: localFilters.fuels.filter((item) => (item as string) !== value),
      });
      return;
    }

    if (key === "category") {
      applyFilters({ ...localFilters, category: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF6]">
      <aside 
        ref={sidebarRef}
        className="hidden lg:block fixed left-0 top-[80px] w-[320px] h-[calc(100vh-80px)] overflow-y-auto overscroll-y-contain bg-[#FBF8F2] border-r border-[#DED6C8] px-6 py-8 pb-20 z-30 pointer-events-auto"
      >
        <FiltersPanel
          filters={localFilters}
          onUpdate={applyFilters}
          onReset={resetAll}
        />
      </aside>

      <div className="flex w-full min-h-screen">
        <main className="min-w-0 flex-1 bg-[#FCFAF6] pb-12 lg:ml-[320px]">
          <div className="mx-auto w-full max-w-[1120px] px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-2 lg:justify-start">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-5 font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510] shadow-[0_6px_14px_rgba(42,53,16,0.06)] transition-colors hover:border-[#A59568] lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              <div className="relative inline-flex h-11 min-w-[150px] items-center rounded-full border border-[#CDBFA8] bg-[#FFFEFB] shadow-[0_6px_14px_rgba(42,53,16,0.06)] lg:hidden">
                <span className="pl-4 pr-1 font-[family-name:var(--font-body)] text-[8px] font-semibold uppercase tracking-[0.15em] text-[#8A846F] shrink-0 pointer-events-none">
                  Sort
                </span>
                <button
                  type="button"
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex h-full w-full items-center justify-between bg-transparent pr-4 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#2A3510] outline-none"
                >
                  <span className="truncate pr-1">
                    {SORT_OPTIONS.find((o) => o.value === localFilters.sort)?.label ?? "Sort"}
                  </span>
                  <ChevronDown size={14} className={`shrink-0 text-[#6C675F] transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {activeFilters.length > 0 ? (
                <div className="hidden lg:flex flex-wrap items-center gap-2">
                  {activeFilters.map((item) => (
                    <button
                      key={`${item.key}-${item.value ?? item.label}`}
                      type="button"
                      onClick={() => removeFilter(item.key, item.value)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] font-medium text-[#4F4A42] shadow-[0_4px_10px_rgba(42,53,16,0.05)] transition-colors hover:border-[#A59568] hover:text-[#2A3510]"
                    >
                      <span>{item.label}</span>
                      <X size={12} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                {activeFilters.map((item) => (
                  <button
                    key={`${item.key}-${item.value ?? item.label}`}
                    type="button"
                    onClick={() => removeFilter(item.key, item.value)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] font-medium text-[#4F4A42] shadow-[0_4px_10px_rgba(42,53,16,0.05)] transition-colors hover:border-[#A59568] hover:text-[#2A3510]"
                  >
                    <span>{item.label}</span>
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}

            <div className="relative hidden lg:inline-flex min-w-[188px] items-center rounded-full border border-[#CDBFA8] bg-[#FFFEFB] shadow-[0_6px_14px_rgba(42,53,16,0.06)]">
              <span className="pl-4 pr-2 font-[family-name:var(--font-body)] text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A846F] shrink-0 pointer-events-none">
                Sort
              </span>
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex h-10 w-full items-center justify-between rounded-r-full bg-transparent pr-4 font-[family-name:var(--font-body)] text-[11px] font-medium text-[#2A3510] outline-none transition-colors hover:text-[#9E884E]"
              >
                <span className="truncate pr-2">
                  {SORT_OPTIONS.find((o) => o.value === localFilters.sort)?.label ?? "Sort"}
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-[#6C675F] transition-transform duration-300 ${sortDropdownOpen ? 'rotate-180 text-[#C9A84C]' : ''}`}
                />
              </button>

              {sortDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setSortDropdownOpen(false)} 
                  />
                  <div className="absolute top-[calc(100%+6px)] right-0 w-[200px] bg-white border border-[#2A3510]/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 bg-[#F1F3E1]/50 border-b border-[#2A3510]/5 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Sort By</span>
                    </div>
                    
                    <div className="flex flex-col py-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            applyFilters({
                              ...localFilters,
                              sort: option.value as BuyFilters["sort"],
                            });
                            setSortDropdownOpen(false);
                          }}
                          className={`text-left px-4 py-2.5 text-[12px] font-medium transition-colors hover:bg-[#F1F3E1] ${localFilters.sort === option.value ? 'text-[#C9A84C] bg-[#C9A84C]/5' : 'text-[#2A3510]'}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            {isPending && (
              <div className="absolute inset-0 z-10 flex items-start justify-center pt-20 rounded-3xl bg-[#FCFAF6]/40 backdrop-blur-[1px] transition-all duration-300">
                <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] border border-[#E7DEC9] animate-in fade-in zoom-in-95 slide-in-from-top-4">
                   <div className="w-4 h-4 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
                   <span className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">
                     Updating results...
                   </span>
                </div>
              </div>
            )}

            {cars.length > 0 ? (
              <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5 transition-all duration-500 ${isPending ? 'opacity-30 blur-[2px]' : 'opacity-100 blur-0'}`}>
                {cars.map((car) => (
                   <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              !isPending && (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A3510]/30 text-center mb-2">
                  No exact matches found
                </p>
              )
            )}

            {otherCars.length > 0 && (
              <div className={`${cars.length === 0 ? 'mt-4' : 'mt-16'} transition-all duration-500 ${isPending ? 'opacity-30 blur-[2px]' : 'opacity-100 blur-0'} animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300`}>
                <div className="relative flex items-center justify-center mb-10">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#CDBFA8] to-transparent" />
                  <div className="relative bg-[#FCFAF6] px-6">
                    <h2 className="font-[family-name:var(--font-display)] text-[16px] font-bold uppercase tracking-[0.25em] text-[#3A4A20]">
                      Explore other premium listings
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
                  {otherCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>

      {/* Gap matching Footer Layout */}
      <div className="h-24 md:h-15 bg-[#DCE1BA]" />

      <FooterSection />

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[32px] bg-[#FCFAF6] p-4 pb-6 shadow-[0_-20px_50px_rgba(0,0,0,0.18)]">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#D7CEBF]" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A846F]">
                  Mobile filters
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-[24px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
                  Refine results
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D8D0C4] bg-white text-[#2A3510]"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            <FiltersPanel
              filters={localFilters}
              onUpdate={(nextFilters) => {
                applyFilters(nextFilters);
              }}
              onReset={resetAll}
              isMobile
            />

            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#2A3510] px-5 py-3 font-[family-name:var(--font-body)] text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
            >
              Show {cars.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
