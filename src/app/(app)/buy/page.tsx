"use client";

import { useState } from "react";
import { Heart, ChevronDown, ChevronUp, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Car {
  id: number;
  name: string;
  subtitle: string;
  bodyType: string;
  transmission: string;
  fuel: string;
  condition: "New" | "Used" | "Certified";
  brand: string;
  year: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CARS: Car[] = [
  { id: 1,  name: "Toyota Land Cruiser",   subtitle: "4.0L V6 (271 hp, 4WD)",           bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "Toyota",        year: 2024 },
  { id: 2,  name: "BMW 5 Series",          subtitle: "3.0L Inline-6 (335 hp, RWD)",     bodyType: "Sedan",     transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "BMW",           year: 2024 },
  { id: 3,  name: "Mercedes-Benz C-Class", subtitle: "2.0L Turbo (255 hp, RWD)",        bodyType: "Sedan",     transmission: "Automatic", fuel: "Gasoline", condition: "Used",      brand: "Mercedes-Benz", year: 2023 },
  { id: 4,  name: "Porsche Cayenne",       subtitle: "3.0L V6 (340 hp, AWD)",           bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "Porsche",       year: 2024 },
  { id: 5,  name: "Ford Mustang",          subtitle: "5.0L V8 (450 hp, RWD)",           bodyType: "Coupe",     transmission: "Manual",    fuel: "Gasoline", condition: "Used",      brand: "Ford",          year: 2022 },
  { id: 6,  name: "Nissan Patrol",         subtitle: "5.6L V8 (400 hp, 4WD)",           bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "Nissan",        year: 2024 },
  { id: 7,  name: "Audi Q7",              subtitle: "3.0L TFSI (335 hp, Quattro)",      bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "Certified", brand: "Audi",          year: 2023 },
  { id: 8,  name: "Range Rover Sport",    subtitle: "3.0L Ingenium (395 hp, AWD)",      bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "Land Rover",    year: 2024 },
  { id: 9,  name: "Honda Civic",          subtitle: "1.5L VTEC Turbo (174 hp, FWD)",    bodyType: "Sedan",     transmission: "Automatic", fuel: "Gasoline", condition: "Used",      brand: "Honda",         year: 2022 },
  { id: 10, name: "Toyota Camry",         subtitle: "2.5L Dynamic Force (203 hp, FWD)", bodyType: "Sedan",     transmission: "Automatic", fuel: "Hybrid",   condition: "New",       brand: "Toyota",        year: 2024 },
  { id: 11, name: "Mercedes-Benz GLE",   subtitle: "3.0L Inline-6 (362 hp, 4MATIC)",   bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "New",       brand: "Mercedes-Benz", year: 2024 },
  { id: 12, name: "Jeep Wrangler",       subtitle: "2.0L Turbo (270 hp, 4WD)",          bodyType: "SUV",       transmission: "Automatic", fuel: "Gasoline", condition: "Used",      brand: "Jeep",          year: 2023 },
];

const BODY_TYPES = ["Sedan", "SUV", "Coupe", "Wagon", "Hatchback", "Pickup", "Sport Coupe", "Crossover", "Van"];
const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid", "Flex Fuel (E85)", "Hydrogen", "Other"];
const BRANDS     = ["All", "Audi", "BMW", "Ford", "Honda", "Jeep", "Land Rover", "Mercedes-Benz", "Nissan", "Porsche", "Toyota"];

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
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg border font-[family-name:var(--font-body)] text-[11px] font-medium transition-all duration-150 cursor-pointer ${
            value === opt
              ? "bg-[#3A4A20] border-[#3A4A20] text-white"
              : "bg-transparent border-[#D0CCC6] text-[#888888] hover:border-[#3A4A20] hover:text-[#2A3510]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: Set<string>;
  onChange: (v: Set<string>) => void;
}) {
  const toggle = (opt: string) => {
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
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="relative w-full aspect-[16/9] bg-[#F6F5F1] rounded-md overflow-hidden border border-[#E0DDD8] transition-all duration-200 hover:border-[#C8C4BE] hover:shadow-[0_4px_20px_rgba(42,53,16,0.08)]">
      {/* Car image */}
      <img
        src={`/car_0${((car.id - 1) % 5) + 1}.png`}
        alt={car.name}
        className="absolute inset-0 w-full h-full object-contain object-center scale-[0.6] origin-center"
      />

      {/* Condition badge */}
      <span
        className="absolute top-3 left-3 font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-md bg-[#3A4A20] text-white"
      >
        {car.condition}
      </span>

      {/* Heart */}
      <button
        onClick={() => setLiked(!liked)}
        aria-label="Save to favourites"
        className="absolute top-3 right-3 p-1 transition-all duration-150 cursor-pointer bg-transparent border-none"
      >
        <Heart
          size={22}
          strokeWidth={1.6}
          className={liked ? "fill-[#3A4A20] text-[#3A4A20]" : "text-[#3A4A20]"}
        />
      </button>

      {/* Name + subtitle overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] leading-tight">
          {car.name}
        </p>
        <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888888]">
          {car.subtitle}
        </p>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyPage() {
  const [condition,    setCondition]    = useState("Any");
  const [bodyTypes,    setBodyTypes]    = useState<Set<string>>(new Set());
  const [transmission, setTransmission] = useState("Any");
  const [fuels,        setFuels]        = useState<Set<string>>(new Set());
  const [brand,        setBrand]        = useState("All");

  const filtered = CARS.filter((c) => {
    if (condition !== "Any" && c.condition !== condition) return false;
    if (bodyTypes.size > 0 && !bodyTypes.has(c.bodyType)) return false;
    if (transmission !== "Any" && c.transmission !== transmission) return false;
    if (fuels.size > 0 && !fuels.has(c.fuel))             return false;
    if (brand !== "All" && c.brand !== brand)              return false;
    return true;
  });

  const resetAll = () => {
    setCondition("Any");
    setBodyTypes(new Set());
    setTransmission("Any");
    setFuels(new Set());
    setBrand("All");
  };

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* ── Filter Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-[260px] shrink-0 bg-[#F6F5F1] sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto px-5 py-5">

        {/* Header */}
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
          <ToggleGroup
            options={["Any", "New", "Used", "Certified"]}
            value={condition}
            onChange={setCondition}
          />
        </div>

        {/* CAR BRAND */}
        <CollapsibleSection title="Car Brand" defaultOpen={false}>
          <div className="flex flex-wrap gap-1.5">
            {BRANDS.map((b) => (
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

        {/* CAR MODEL & YEAR */}
        <CollapsibleSection title="Car Model & Year" defaultOpen={false}>
          <p className="font-[family-name:var(--font-body)] text-[11.5px] text-[#BBBBBB] italic">
            Select a brand first
          </p>
        </CollapsibleSection>

        {/* BODY TYPE */}
        <CollapsibleSection title="Body Type">
          <CheckboxGroup
            options={BODY_TYPES}
            values={bodyTypes}
            onChange={setBodyTypes}
          />
        </CollapsibleSection>

        {/* TRANSMISSION */}
        <CollapsibleSection title="Transmission">
          <ToggleGroup
            options={["Any", "Automatic", "Manual"]}
            value={transmission}
            onChange={setTransmission}
          />
        </CollapsibleSection>

        {/* FUEL TYPE */}
        <CollapsibleSection title="Fuel Type">
          <CheckboxGroup
            options={FUEL_TYPES}
            values={fuels}
            onChange={setFuels}
          />
        </CollapsibleSection>

      </aside>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 px-6 py-6 overflow-y-auto bg-white">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(20px,2.2vw,28px)] font-semibold uppercase tracking-[-0.01em] text-[#2A3510] leading-none">
            {filtered.length} vehicles for sale
          </h1>
        </div>

        {/* Grid */}
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
