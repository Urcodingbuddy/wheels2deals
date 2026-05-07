"use client";

import { useState } from "react";
import { Heart, ChevronDown, ChevronUp, X, MapPin, Gauge, Fuel, Settings2 } from "lucide-react";
import type { Tables, Enums } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

type Car = Tables<"cars">;

type Condition = "Any" | "New" | "Certified" | "Used";

function deriveCondition(kmDriven: number): "New" | "Certified" | "Used" {
  if (kmDriven === 0) return "New";
  if (kmDriven < 30000) return "Certified";
  return "Used";
}

// ─── Filter constants ─────────────────────────────────────────────────────────

const BODY_TYPES: Enums<"car_type">[] = [
  "sedan", "suv", "hatchback", "coupe", "convertible", "wagon", "van", "truck", "motorcycle", "other",
];

const FUEL_LABELS: Record<Enums<"fuel_type">, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  electric: "Electric",
  hybrid: "Hybrid",
  cng: "CNG",
  lpg: "LPG",
};

const TRANSMISSION_LABELS: Record<Enums<"transmission_type">, string> = {
  manual: "Manual",
  automatic: "Automatic",
  cvt: "CVT",
  amt: "AMT",
};

const BODY_TYPE_LABELS: Record<Enums<"car_type">, string> = {
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    <div className="border-t border-[#EDEAE6] py-4">
      <button
        className="w-full flex items-center justify-between mb-3 cursor-pointer bg-transparent border-none p-0"
        onClick={() => setOpen(!open)}
      >
        <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888]">
          {title}
        </span>
        {open
          ? <ChevronUp size={13} className="text-[#BBBBBB] shrink-0" />
          : <ChevronDown size={13} className="text-[#BBBBBB] shrink-0" />}
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
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg border font-[family-name:var(--font-body)] text-[11px] font-medium transition-all duration-150 cursor-pointer ${
            value === opt.value
              ? "bg-[#3A4A20] border-[#3A4A20] text-white"
              : "bg-transparent border-[#D0CCC6] text-[#888888] hover:border-[#3A4A20] hover:text-[#2A3510]"
          }`}
        >
          {opt.label}
        </button>
      ))}
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
  values: Set<T>;
  onChange: (v: Set<T>) => void;
  labelMap: Record<T, string>;
}) {
  const toggle = (opt: T) => {
    const next = new Set(values);
    next.has(opt) ? next.delete(opt) : next.add(opt);
    onChange(next);
  };
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggle(opt)}>
          <div
            className={`w-[14px] h-[14px] rounded-[3px] border shrink-0 flex items-center justify-center transition-all duration-150 ${
              values.has(opt)
                ? "bg-[#3A4A20] border-[#3A4A20]"
                : "bg-transparent border-[#C8C4BE] group-hover:border-[#3A4A20]"
            }`}
          >
            {values.has(opt) && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="font-[family-name:var(--font-body)] text-[12px] text-[#555555] group-hover:text-[#2A3510] transition-colors duration-150 select-none leading-none">
            {labelMap[opt]}
          </span>
        </label>
      ))}
    </div>
  );
}

const CONDITION_STYLE: Record<string, string> = {
  New:       "bg-emerald-500 text-white",
  Certified: "bg-sky-500 text-white",
  Used:      "bg-[#3A4A20] text-white",
};

const BUBBLE_ANGLES = [0, 60, 120, 180, 240, 300];

function CarCard({ car }: { car: Car }) {
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(false);
  const [popKey, setPopKey] = useState(0);

  function handleLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!liked) {
      setBurst(true);
      setPopKey((k) => k + 1);
      setTimeout(() => setBurst(false), 600);
    }
    setLiked((prev) => !prev);
  }

  const condition = deriveCondition(car.km_driven);
  const imageUrl = car.images[0] ?? null;

  const kmLabel = car.km_driven === 0
    ? "Brand New"
    : `${car.km_driven.toLocaleString()} km`;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#E8E4DE] shadow-[0_2px_8px_rgba(42,53,16,0.06)] hover:shadow-[0_12px_36px_rgba(42,53,16,0.13)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      {/* ── Image ── */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F5F1]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-[family-name:var(--font-body)] text-[11px] text-[#BBBBBB]">No image</span>
          </div>
        )}

        {/* Condition badge */}
        <span className={`absolute top-3 left-3 font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full shadow-sm ${CONDITION_STYLE[condition]}`}>
          {condition}
        </span>

        {/* Heart */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleLike}
            aria-label="Save to favourites"
            className="relative cursor-pointer border-none bg-transparent p-1.5"
          >
            {/* Burst bubbles */}
            {burst && BUBBLE_ANGLES.map((angle, i) => (
              <span
                key={angle}
                className="heart-bubble"
                style={{
                  "--angle": `${angle}deg`,
                  width: i % 2 === 0 ? 5 : 4,
                  height: i % 2 === 0 ? 5 : 4,
                  animationDelay: `${i * 20}ms`,
                } as React.CSSProperties}
              />
            ))}
            {/* Heart icon */}
            <Heart
              key={popKey}
              size={20}
              strokeWidth={1.8}
              className={`relative z-10 drop-shadow-sm transition-colors duration-200 ${
                liked
                  ? "fill-[#3A4A20] text-white heart-pop"
                  : "fill-transparent text-white"
              }`}
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
            />
          </button>
        </div>

        {/* Year chip bottom-right */}
        <span className="absolute bottom-3 right-3 font-[family-name:var(--font-body)] text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {car.year}
        </span>
      </div>

      {/* ── Details ── */}
      <div className="px-4 pt-3.5 pb-4">

        {/* Title */}
        <h3 className="font-[family-name:var(--font-display)] text-[14.5px] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] leading-snug truncate mb-2.5">
          {car.title}
        </h3>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-[10.5px] text-[#666] bg-[#F3F1EC] px-2 py-0.5 rounded-md">
            <Gauge size={10} strokeWidth={1.8} className="text-[#3A4A20]" />
            {kmLabel}
          </span>
          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-[10.5px] text-[#666] bg-[#F3F1EC] px-2 py-0.5 rounded-md">
            <Fuel size={10} strokeWidth={1.8} className="text-[#3A4A20]" />
            {FUEL_LABELS[car.fuel_type]}
          </span>
          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-[10.5px] text-[#666] bg-[#F3F1EC] px-2 py-0.5 rounded-md">
            <Settings2 size={10} strokeWidth={1.8} className="text-[#3A4A20]" />
            {TRANSMISSION_LABELS[car.transmission]}
          </span>
          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-[10.5px] text-[#666] bg-[#F3F1EC] px-2 py-0.5 rounded-md">
            <MapPin size={10} strokeWidth={1.8} className="text-[#3A4A20]" />
            {car.location}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Main client component ────────────────────────────────────────────────────

export default function BuyClient({ cars, brands }: { cars: Car[]; brands: string[] }) {
  const [condition,    setCondition]    = useState<Condition>("Any");
  const [bodyTypes,    setBodyTypes]    = useState<Set<Enums<"car_type">>>(new Set());
  const [transmission, setTransmission] = useState("any");
  const [fuels,        setFuels]        = useState<Set<Enums<"fuel_type">>>(new Set());
  const [brand,        setBrand]        = useState("All");

  const filtered = cars.filter((c) => {
    if (condition !== "Any" && deriveCondition(c.km_driven) !== condition) return false;
    if (bodyTypes.size > 0 && !bodyTypes.has(c.type)) return false;
    if (transmission !== "any" && c.transmission !== transmission) return false;
    if (fuels.size > 0 && !fuels.has(c.fuel_type)) return false;
    if (brand !== "All" && c.brand !== brand) return false;
    return true;
  });

  const resetAll = () => {
    setCondition("Any");
    setBodyTypes(new Set());
    setTransmission("any");
    setFuels(new Set());
    setBrand("All");
  };

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
    <div className="flex" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* ── Filter Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-[260px] shrink-0 bg-[#F6F5F1] sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto px-5 py-5">

        <div className="flex items-center justify-between mb-5">
          <span className="font-[family-name:var(--font-body)] text-[13.5px] font-semibold text-[#2A3510]">
            Filter by
          </span>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 font-[family-name:var(--font-body)] text-[11px] text-[#888888] hover:text-[#2A3510] transition-colors duration-150 cursor-pointer bg-transparent border-none"
          >
            Reset all <X size={10} />
          </button>
        </div>

        {/* CONDITION */}
        <div className="mb-1">
          <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888] mb-3">
            Condition
          </p>
          <ToggleGroup options={conditionOptions} value={condition} onChange={(v) => setCondition(v as Condition)} />
        </div>

        {/* CAR BRAND */}
        <CollapsibleSection title="Car Brand" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...brands].map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`px-2.5 py-1 rounded-md border font-[family-name:var(--font-body)] text-[10.5px] font-medium transition-all duration-150 cursor-pointer ${
                  brand === b
                    ? "bg-[#3A4A20] border-[#3A4A20] text-white"
                    : "bg-transparent border-[#D0CCC6] text-[#888888] hover:border-[#3A4A20] hover:text-[#2A3510]"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </CollapsibleSection>

        {/* BODY TYPE */}
        <CollapsibleSection title="Body Type">
          <CheckboxGroup
            options={BODY_TYPES}
            values={bodyTypes}
            onChange={setBodyTypes}
            labelMap={BODY_TYPE_LABELS}
          />
        </CollapsibleSection>

        {/* TRANSMISSION */}
        <CollapsibleSection title="Transmission">
          <ToggleGroup options={transmissionOptions} value={transmission} onChange={setTransmission} />
        </CollapsibleSection>

        {/* FUEL TYPE */}
        <CollapsibleSection title="Fuel Type">
          <CheckboxGroup
            options={Object.keys(FUEL_LABELS) as Enums<"fuel_type">[]}
            values={fuels}
            onChange={setFuels}
            labelMap={FUEL_LABELS}
          />
        </CollapsibleSection>

      </aside>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 py-6 overflow-y-auto bg-white">

        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(20px,2.2vw,28px)] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] leading-none">
            {filtered.length} vehicles for sale
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 py-20 flex flex-col items-center gap-3">
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888]">
                No vehicles match your filters.
              </p>
              <button
                onClick={resetAll}
                className="font-[family-name:var(--font-body)] text-[11px] text-[#3A4A20] underline underline-offset-2 cursor-pointer bg-transparent border-none hover:text-[#2A3510] transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
