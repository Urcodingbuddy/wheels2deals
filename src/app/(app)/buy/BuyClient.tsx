"use client";

import { useMemo, useState, useTransition } from "react";
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
  | "fuel";

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
            onClick={() => onChange(option.value)}
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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6F674F]">
                {car.brand}
              </p>
              <h3 className="mt-1 line-clamp-2 font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase leading-tight tracking-[-0.02em] text-[#223006]">
                {car.title}
              </h3>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-body)] text-[11px] font-medium text-[#5E5748]">
                Ready to drive
              </p>
            </div>
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
                Vehicle type
              </p>
              <p className="mt-1 font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#223006]">
                {BODY_TYPE_LABELS[car.type]}
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
}: {
  filters: BuyFilters;
  onUpdate: (nextFilters: BuyFilters) => void;
  onReset: () => void;
}) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

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
    <div className="rounded-[24px] border border-[#DDD3C2] bg-[linear-gradient(180deg,#FBF8F2_0%,#F1EBE0_100%)] p-5 shadow-[0_16px_36px_rgba(42,53,16,0.1)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A846F]">
            Filters
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-[24px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Refine your shortlist
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-full border border-[#BFAF97] bg-[#FFFEFB] px-3 py-2 font-[family-name:var(--font-body)] text-[11px] font-semibold text-[#4D473E] transition-colors hover:border-[#8D7A45] hover:text-[#2A3510]"
        >
          Reset <X size={12} />
        </button>
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
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
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
                  <div className="p-3 bg-[#F1F3E1]/50 border-b border-[#2A3510]/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Select Brand</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full text-[#2A3510]/40 border border-[#2A3510]/5">{KNOWN_BRANDS.length} listed</span>
                  </div>
                  
                  <div 
                    className="max-h-[220px] overflow-y-auto overscroll-contain flex flex-col py-1"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                  >
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
                    {KNOWN_BRANDS.map(brand => (
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
  brands,
  filters,
}: {
  cars: Car[];
  brands: string[];
  filters: BuyFilters;
}) {
  return (
    <BuyClientView
      key={JSON.stringify(filters)}
      cars={cars}
      brands={brands}
      filters={filters}
    />
  );
}

function BuyClientView({
  cars,
  brands,
  filters,
}: {
  cars: Car[];
  brands: string[];
  filters: BuyFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

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

    return items;
  }, [localFilters]);

  const applyFilters = (nextFilters: BuyFilters) => {
    setLocalFilters(nextFilters);

    const params = createSearchParams(nextFilters);
    const target = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(target, { scroll: false });
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
    }
  };

  return (
    <div className="min-h-screen bg-[#DCE1BA]">
      <div className="bg-[#FCFAF6] rounded-b-[40px] md:rounded-b-[60px] pb-12">
      <div className="mx-auto flex w-[92vw] max-w-[1440px] gap-6 py-6 lg:gap-8 lg:py-8">
        <aside className="hidden w-[310px] shrink-0 lg:block">
          <div className="lg:sticky lg:top-[84px]">
            <FiltersPanel
              filters={localFilters}
              onUpdate={applyFilters}
              onReset={resetAll}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-4 py-2 font-[family-name:var(--font-body)] text-[11px] font-semibold text-[#2A3510] shadow-[0_6px_14px_rgba(42,53,16,0.06)] transition-colors hover:border-[#A59568] lg:hidden"
              >
                <SlidersHorizontal size={15} />
                Filters
              </button>

              {activeFilters.length > 0 ? (
                activeFilters.map((item) => (
                  <button
                    key={`${item.key}-${item.value ?? item.label}`}
                    type="button"
                    onClick={() => removeFilter(item.key, item.value)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#D7CEBF] bg-white px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] font-medium text-[#4F4A42] shadow-[0_4px_10px_rgba(42,53,16,0.05)] transition-colors hover:border-[#A59568] hover:text-[#2A3510]"
                  >
                    <span>{item.label}</span>
                    <X size={12} />
                  </button>
                ))
              ) : null}
            </div>

            <div className="relative inline-flex min-w-[188px] items-center rounded-full border border-[#CDBFA8] bg-[#FFFEFB] shadow-[0_6px_14px_rgba(42,53,16,0.06)] self-start lg:self-auto">
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
                <div className="py-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-20 h-20 rounded-full bg-[#F0EBE1] flex items-center justify-center mb-8 relative">
                    <Search className="w-8 h-8 text-[#2A3510]/30" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#F0EBE1] flex items-center justify-center shadow-sm">
                      <X className="w-4 h-4 text-[#C9A84C]" />
                    </div>
                  </div>
                  
                  <h3 className="font-[family-name:var(--font-display)] text-[28px] font-bold text-[#2A3510] mb-4 tracking-tight">
                    No vehicles match this view.
                  </h3>
                  
                  <p className="max-w-md mx-auto font-[family-name:var(--font-body)] text-[15px] leading-relaxed text-[#2A3510]/50 mb-10">
                    Try a broader search, switch brand, or clear a few filters to bring more available cars back into the list.
                  </p>
                  
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center justify-center rounded-full bg-[#2A3510] px-8 py-3.5 font-[family-name:var(--font-body)] text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#C9A84C] hover:shadow-[0_8px_20px_rgba(201,168,76,0.3)] active:scale-95"
                  >
                    Reset all filters
                  </button>
                </div>
              )
            )}
          </div>
        </main>
      </div>
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
