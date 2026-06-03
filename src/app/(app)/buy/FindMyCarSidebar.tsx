"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { createClient } from "@/lib/client";
import { UAEFlag } from "@/components/shared/UAEFlag";
import { validateUAEPhone, standardizeUAEPhone } from "@/lib/validation";

// ── Types & constants ─────────────────────────────────────────────────────────

type FormFields = "fullName" | "phone" | "brand" | "model" | "budget" | "yearRange" | "timeline" | "notes";

const BUDGET_OPTIONS = [
  "Under 30,000", "30,000 - 60,000", "60,000 - 100,000",
  "100,000 - 200,000", "200,000 - 400,000", "Above 400,000",
];

const YEAR_RANGE_OPTIONS = [
  "Any year", "2024-2026", "2021-2023", "2018-2020", "2015-2017", "Older than 2015",
];

const TIMELINE_OPTIONS = [
  "Within 24 hours", "This week", "Within a month", "Just exploring",
];

// ── Shared floating text input ────────────────────────────────────────────────

function FloatingField({ label, required = false, value, onChange, type = "text", placeholder, error }: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; error?: string | null;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;
  const isPhone = type === "tel";
  return (
    <div className="relative shrink-0 flex flex-col gap-1">
      <div className="relative pt-4">
        <label className={[
          "absolute pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)] whitespace-nowrap",
          floated
            ? "top-0 left-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
            : isPhone
              ? "top-[13px] left-[94px] text-[16px] text-[#2A3510]"
              : "top-[13px] left-0 text-[16px] text-[#2A3510]",
        ].join(" ")}>
          {label}{required && <span className="ml-0.5 text-[#2A3510]/50">*</span>}
        </label>
        <div className="flex items-center gap-2 border-b transition-colors duration-200 w-full"
             style={{ borderColor: error ? "#F87171" : focused ? "#2A3510" : "#DDD7CE" }}>
          {isPhone && (
            <div className="flex items-center gap-1.5 shrink-0 bg-[#2A3510]/5 px-2.5 py-1.5 rounded border border-[#2A3510]/10 text-[#2A3510]/70 mb-1">
              <UAEFlag className="w-5.5 h-3" />
              <span className="text-[14px] font-bold tracking-wider">+971</span>
            </div>
          )}
          <input
            type={type} value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            className="w-full bg-transparent pb-1.5 outline-none text-[16px] text-[#2A3510] font-[family-name:var(--font-body)] placeholder:text-[#C0BAB0] border-none"
          />
        </div>
      </div>
      {error && (
        <span className="font-[family-name:var(--font-body)] text-[10px] text-red-500 font-medium leading-none">
          {error}
        </span>
      )}
    </div>
  );
}

// ── Dropdown portal (fixed-positioned, escapes overflow:hidden) ────────────────

function DropdownPortal({ triggerRect, onClose, children }: {
  triggerRect: DOMRect; onClose: () => void; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className="fixed z-[9999] rounded-2xl border border-[#E5DDD0] bg-[#FBF8F2] shadow-[0_16px_40px_rgba(42,53,16,0.14)] overflow-hidden flex flex-col"
      onWheel={e => e.stopPropagation()}
      style={{
        top: triggerRect.bottom + 4,
        right: window.innerWidth - triggerRect.right,
        width: triggerRect.width,
        maxHeight: 240,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// ── SelectField — static option list (Budget, Year Range, Timeline) ────────────

function SelectField({ label, required = false, value, onChange, options }: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const floated = !!value;
  const close = useCallback(() => setOpen(false), []);

  function toggle() {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(o => !o);
  }

  return (
    <div ref={ref} className="relative shrink-0 cursor-pointer" onClick={toggle}>
      <label className={[
        "pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)]",
        floated
          ? "absolute left-0 top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
          : "absolute left-0 top-[13px] text-[16px] text-[#2A3510]",
      ].join(" ")}>
        {label}{required && <span className="ml-0.5 text-[#2A3510]/50">*</span>}
      </label>
      <div className={`w-full pt-4 pb-1.5 flex items-center justify-between border-b transition-colors duration-200 ${open ? "border-[#2A3510]" : "border-[#DDD7CE]"}`}>
        <span className="font-[family-name:var(--font-body)] text-[16px] text-[#2A3510]">{value}</span>
        <ChevronDown size={13} strokeWidth={2} className={`text-[#AAA49C] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>
      {open && rect && (
        <DropdownPortal triggerRect={rect} onClose={close}>
          <div className="overflow-y-auto flex-1" onWheel={e => e.stopPropagation()}>
            {options.map(opt => (
              <button
                key={opt} type="button"
                onMouseDown={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] transition-colors flex items-center justify-between ${
                  value === opt ? "bg-[#2A3510]/8 text-[#2A3510] font-semibold" : "text-[#555] hover:bg-[#2A3510]/5 hover:text-[#2A3510]"
                }`}
              >
                {opt}
                {value === opt && <Check size={12} strokeWidth={2.5} className="text-[#2A3510]" />}
              </button>
            ))}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}

// ── BrandField — search + prefetched list + custom entry ──────────────────────

function BrandField({ value, onChange, onFromList }: {
  value: string; onChange: (v: string) => void; onFromList: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [makes, setMakes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const floated = !!value;
  const close = useCallback(() => { setOpen(false); setSearch(""); }, []);

  useEffect(() => {
    fetch("/api/car-makes").then(r => r.json()).then(d => setMakes(d.makes ?? [])).catch(() => {});
  }, []);

  const filtered = search.trim() ? makes.filter(m => m.toLowerCase().includes(search.toLowerCase())) : makes;
  const showCustom = search.trim() && !filtered.some(m => m.toLowerCase() === search.toLowerCase());

  function openDropdown() {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setSearch("");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function selectMake(make: string) {
    onChange(make); onFromList(true); setOpen(false); setSearch("");
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <label className={[
        "absolute left-0 pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)]",
        floated
          ? "top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
          : "top-[13px] text-[16px] text-[#2A3510]",
      ].join(" ")}>
        Brand<span className="ml-0.5 text-[#2A3510]/50">*</span>
      </label>
      {/* Trigger — always the same display row */}
      <div
        className={`w-full pt-4 pb-1.5 flex items-center justify-between border-b cursor-pointer transition-colors duration-200 ${open ? "border-[#2A3510]" : "border-[#DDD7CE]"}`}
        onClick={openDropdown}
      >
        <span className={`font-[family-name:var(--font-body)] text-[16px] ${value ? "text-[#2A3510]" : "text-transparent select-none"}`}>{value || "·"}</span>
        <ChevronDown size={13} strokeWidth={2} className={`text-[#AAA49C] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && rect && (
        <DropdownPortal triggerRect={rect} onClose={close}>
          {/* Search bar inside the panel */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EAE6DF] sticky top-0 bg-[#FBF8F2]">
            <Search size={13} className="text-[#C0BAB0] shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search brand..."
              className="flex-1 bg-transparent outline-none font-[family-name:var(--font-body)] text-[15px] text-[#2A3510] placeholder:text-[#C0BAB0]"
            />
            {search && (
              <button type="button" onMouseDown={() => setSearch("")} className="border-none bg-transparent cursor-pointer p-0">
                <X size={11} className="text-[#AAA49C]" />
              </button>
            )}
          </div>
          {/* Results */}
          <div className="overflow-y-auto flex-1" onWheel={e => e.stopPropagation()}>
            {filtered.slice(0, 80).map(m => (
              <button key={m} type="button" onMouseDown={() => selectMake(m)}
                className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] transition-colors flex items-center justify-between ${
                  value === m ? "bg-[#2A3510]/8 text-[#2A3510] font-semibold" : "text-[#555] hover:bg-[#2A3510]/5 hover:text-[#2A3510]"
                }`}>
                {m}{value === m && <Check size={12} strokeWidth={2.5} className="text-[#2A3510]" />}
              </button>
            ))}
            {showCustom && (
              <button type="button" onMouseDown={() => selectMake(search)}
                className="w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] text-[#888] italic hover:bg-[#2A3510]/5 hover:text-[#2A3510] border-t border-[#EAE6DF]">
                Use &ldquo;{search}&rdquo;
              </button>
            )}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}

// ── ModelField — dropdown if brand from list, plain input if custom ────────────

function ModelField({ value, onChange, brand, brandFromList }: {
  value: string; onChange: (v: string) => void; brand: string; brandFromList: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => { setOpen(false); setSearch(""); }, []);

  useEffect(() => {
    if (!brand || !brandFromList) { setModels([]); return; }
    fetch(`/api/car-models?make=${encodeURIComponent(brand)}`)
      .then(r => r.json()).then(d => setModels(d.models ?? [])).catch(() => setModels([]));
  }, [brand, brandFromList]);

  if (!brandFromList) {
    return <FloatingField label="Model / Variant" required value={value} onChange={onChange} />;
  }

  const filtered = search.trim() ? models.filter(m => m.toLowerCase().includes(search.toLowerCase())) : models;
  const showCustom = search.trim() && !filtered.some(m => m.toLowerCase() === search.toLowerCase());
  const floated = !!value;

  function openDropdown() {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setSearch("");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <label className={[
        "absolute left-0 pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)]",
        floated
          ? "top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
          : "top-[13px] text-[16px] text-[#2A3510]",
      ].join(" ")}>
        Model / Variant<span className="ml-0.5 text-[#2A3510]/50">*</span>
      </label>
      {/* Trigger */}
      <div
        className={`w-full pt-4 pb-1.5 flex items-center justify-between border-b cursor-pointer transition-colors duration-200 ${open ? "border-[#2A3510]" : "border-[#DDD7CE]"}`}
        onClick={openDropdown}
      >
        <span className={`font-[family-name:var(--font-body)] text-[16px] ${value ? "text-[#2A3510]" : "text-transparent select-none"}`}>{value || "·"}</span>
        <ChevronDown size={13} strokeWidth={2} className={`text-[#AAA49C] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && rect && (
        <DropdownPortal triggerRect={rect} onClose={close}>
          {/* Search bar inside the panel */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EAE6DF] sticky top-0 bg-[#FBF8F2]">
            <Search size={13} className="text-[#C0BAB0] shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search model..."
              className="flex-1 bg-transparent outline-none font-[family-name:var(--font-body)] text-[15px] text-[#2A3510] placeholder:text-[#C0BAB0]"
            />
            {search && (
              <button type="button" onMouseDown={() => setSearch("")} className="border-none bg-transparent cursor-pointer p-0">
                <X size={11} className="text-[#AAA49C]" />
              </button>
            )}
          </div>
          {/* Results */}
          <div className="overflow-y-auto flex-1" onWheel={e => e.stopPropagation()}>
            {models.length === 0 && (
              <p className="px-4 py-3 font-[family-name:var(--font-body)] text-[12px] text-[#AAA49C]">Loading models...</p>
            )}
            {filtered.slice(0, 80).map(m => (
              <button key={m} type="button" onMouseDown={() => { onChange(m); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] transition-colors flex items-center justify-between ${
                  value === m ? "bg-[#2A3510]/8 text-[#2A3510] font-semibold" : "text-[#555] hover:bg-[#2A3510]/5 hover:text-[#2A3510]"
                }`}>
                {m}{value === m && <Check size={12} strokeWidth={2.5} className="text-[#2A3510]" />}
              </button>
            ))}
            {showCustom && (
              <button type="button" onMouseDown={() => { onChange(search); setOpen(false); setSearch(""); }}
                className="w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] text-[#888] italic hover:bg-[#2A3510]/5 hover:text-[#2A3510] border-t border-[#EAE6DF]">
                Use &ldquo;{search}&rdquo;
              </button>
            )}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}

// ── Shared form body ──────────────────────────────────────────────────────────

function DreamCarForm({ form, phase, submitted, loading, brandFromList, phoneError, update, onBrandFromList, onSubmit }: {
  form: Record<FormFields, string>;
  phase: 1 | 2 | 3;
  submitted: boolean;
  loading: boolean;
  brandFromList: boolean;
  phoneError: string | null;
  update: (field: FormFields) => (v: string) => void;
  onBrandFromList: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-8 text-center px-5">
        <div className="w-10 h-10 rounded-full bg-[#2A3510]/8 flex items-center justify-center mb-3 border border-[#2A3510]/20">
          <Check size={18} className="text-[#2A3510]" />
        </div>
        <p className="font-[family-name:var(--font-display)] text-[14px] font-semibold text-[#2A3510] mb-1">Request Sent!</p>
        <p className="font-[family-name:var(--font-body)] text-[11px] text-[#AAA49C] leading-snug">
          We'll reach out via WhatsApp shortly.
        </p>
      </div>
    );
  }

  const animate = "animate-in slide-in-from-bottom-3 fade-in duration-300";

  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-y-3 justify-center">

        <FloatingField label="Full Name" required value={form.fullName} onChange={update("fullName")} />
        <FloatingField label="Phone Number" required type="tel" value={form.phone} onChange={update("phone")} error={phoneError} />
        <BrandField value={form.brand} onChange={update("brand")} onFromList={onBrandFromList} />

        {phase >= 2 && (
          <>
            <div className={animate} style={{ animationDelay: "0ms", animationFillMode: "both" }}>
              <ModelField value={form.model} onChange={update("model")} brand={form.brand} brandFromList={brandFromList} />
            </div>
            <div className={animate} style={{ animationDelay: "70ms", animationFillMode: "both" }}>
              <SelectField label="Budget (AED)" required value={form.budget} onChange={update("budget")} options={BUDGET_OPTIONS} />
            </div>
          </>
        )}

        {phase >= 3 && (
          <>
            <div className={animate} style={{ animationDelay: "0ms", animationFillMode: "both" }}>
              <SelectField label="Year Range" value={form.yearRange} onChange={update("yearRange")} options={YEAR_RANGE_OPTIONS} />
            </div>
            <div className={animate} style={{ animationDelay: "70ms", animationFillMode: "both" }}>
              <SelectField label="When do you need it?" value={form.timeline} onChange={update("timeline")} options={TIMELINE_OPTIONS} />
            </div>
            <div className={animate} style={{ animationDelay: "140ms", animationFillMode: "both" }}>
              <FloatingField label="Anything specific?" value={form.notes} onChange={update("notes")} placeholder="color, features, trade-in" />
            </div>
          </>
        )}

        {/* Car Illustration */}
        <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center justify-center shrink-0 ${
          phase === 1 
            ? "h-28 opacity-100 mt-4" 
            : phase === 2 
              ? "h-14 opacity-40 mt-2" 
              : "h-0 opacity-0 mt-0 pointer-events-none"
        }`}>
          <img 
            src="/booking_illustration.png" 
            alt="Find My Car Illustration" 
            className="w-full h-full object-contain max-w-[180px] mx-auto filter drop-shadow-[0_4px_12px_rgba(42,53,16,0.06)]"
          />
        </div>
      </div>

      <div className="shrink-0 px-5 pt-3 pb-4 border-t border-[#EAE6DF]">
        <button
          type="submit" disabled={loading}
          className="w-full rounded-full py-3 font-[family-name:var(--font-body)] text-[10.5px] font-bold uppercase tracking-[0.2em] bg-[#2A3510] text-white hover:bg-[#3A4A20] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? "Sending..." : "Send Request"}
        </button>
      </div>
    </form>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function FindMyCarSidebar() {
  const emptyForm: Record<FormFields, string> = {
    fullName: "", phone: "", brand: "", model: "",
    budget: "", yearRange: "", timeline: "", notes: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandFromList, setBrandFromList] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const dragStartYRef = useRef<number | null>(null);

  const update = (field: FormFields) => (v: string) => {
    setForm(prev => ({ ...prev, [field]: v }));
    if (field === "phone" && phoneError) setPhoneError(null);
  };

  // Clear model when brand changes
  const prevBrandRef = useRef(form.brand);
  useEffect(() => {
    if (prevBrandRef.current !== form.brand) {
      setForm(prev => ({ ...prev, model: "" }));
      prevBrandRef.current = form.brand;
    }
  }, [form.brand]);

  useEffect(() => {
    if (phase === 1 && form.fullName.trim() && form.phone.trim() && form.brand.trim()) {
      if (validateUAEPhone(form.phone)) {
        setPhase(2);
        setPhoneError(null);
      } else {
        if (form.phone.replace(/[\s\-()]/g, "").length >= 7) {
          setPhoneError("Valid UAE phone required");
        }
      }
    }
  }, [form.fullName, form.phone, form.brand, phase]);

  useEffect(() => {
    if (phase === 2 && form.model.trim() && form.budget.trim()) setPhase(3);
  }, [form.model, form.budget, phase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validateUAEPhone(form.phone)) {
      setPhoneError("Valid UAE phone required");
      return;
    }
    setPhoneError(null);

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("dream_car_requests").insert({
        full_name:  form.fullName.trim(),
        phone:      standardizeUAEPhone(form.phone),
        brand:      form.brand.trim(),
        model:      form.model.trim() || null,
        budget:     form.budget.trim() || null,
        year_range: form.yearRange.trim() || null,
        timeline:   form.timeline.trim() || null,
        notes:      form.notes.trim() || null,
        status:     "new",
      });
      if (error) { console.error("dream_car_requests insert error:", error); alert("Something went wrong. Please try again."); return; }

      setSubmitted(true);
      window.setTimeout(() => { setSubmitted(false); setPhase(1); setForm(emptyForm); setBrandFromList(false); }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const closeSheet = () => { setSheetOpen(false); setSheetDragY(0); };

  const renderDots = (dark: boolean) => (
    <div className="flex items-center gap-1.5">
      {([1, 2, 3] as const).map(p => (
        <div 
          key={p} 
          className={`rounded-full transition-all duration-300 ${
            phase >= p 
              ? dark ? "w-4 h-1.5 bg-[#C9A84C]" : "w-4 h-1.5 bg-[#2A3510]" 
              : dark ? "w-1.5 h-1.5 bg-white/20" : "w-1.5 h-1.5 bg-[#DDD7CE]"
          }`} 
        />
      ))}
    </div>
  );

  const formProps = { form, phase, submitted, loading, brandFromList, phoneError, update, onBrandFromList: setBrandFromList, onSubmit: handleSubmit };

  return (
    <>
      {/* ── Desktop right sidebar (xl+) ─────────────────────────────────── */}
      <aside
        className="hidden xl:flex flex-col fixed right-0 top-[72px] z-30 bg-[#FBF8F2] border-l border-[#E5DDD0] rounded-bl-2xl shadow-[-8px_8px_32px_rgba(42,53,16,0.15)]"
        style={{ width: 280, height: "calc(100vh - 72px)", overflow: "hidden" }}
      >
        <div className="shrink-0 flex items-center justify-between px-5 py-4 bg-[#2A3510] text-white">
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-display)] text-[14px] font-bold uppercase tracking-wider text-[#C9A84C] leading-tight whitespace-nowrap">Find My Dream Car</h2>
            <p className="font-[family-name:var(--font-body)] text-[10px] text-white/60 leading-snug mt-1">
              Tell us what you want - we&apos;ll source it for you.
            </p>
          </div>
          <div className="shrink-0 ml-3">
            {renderDots(true)}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <DreamCarForm {...formProps} />
        </div>
      </aside>

      {/* ── Mobile sticky button (< xl) ──────────────────────────────────── */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-gradient-to-t from-[#FBF8F2]/95 via-[#FBF8F2]/80 to-transparent">
        <button onClick={() => setSheetOpen(true)}
          className="w-full py-4 rounded-full bg-[#2A3510] text-white font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.15em] uppercase hover:bg-[#3A4A20] active:scale-[0.98] transition-all duration-200 shadow-[0_8px_24px_rgba(42,53,16,0.25)]">
          Find My Dream Car
        </button>
      </div>

      {/* ── Mobile bottom sheet ──────────────────────────────────────────── */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm xl:hidden" onClick={closeSheet}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[92vh] flex flex-col rounded-t-[28px] bg-[#FBF8F2] shadow-[0_-20px_50px_rgba(0,0,0,0.18)]"
            style={{ transform: `translateY(${sheetDragY}px)`, transition: dragStartYRef.current === null ? "transform 0.28s cubic-bezier(0.32,0.72,0,1)" : "none" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
              onTouchStart={e => { dragStartYRef.current = e.touches[0].clientY; }}
              onTouchMove={e => { if (dragStartYRef.current === null) return; const d = e.touches[0].clientY - dragStartYRef.current; if (d > 0) setSheetDragY(d); }}
              onTouchEnd={() => { if (sheetDragY > 80) closeSheet(); setSheetDragY(0); dragStartYRef.current = null; }}
            >
              <div className="h-1 w-12 rounded-full bg-[#DDD7CE]" />
              <button type="button" onClick={closeSheet} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0ECE6] text-[#6B6560] hover:bg-[#E5DDD0] transition-colors border-none cursor-pointer">
                <X size={15} />
              </button>
            </div>
            {/* Sheet header */}
            <div className="shrink-0 flex items-center justify-between px-5 py-4 bg-[#2A3510] text-white">
              <div className="min-w-0">
                <h2 className="font-[family-name:var(--font-display)] text-[16.5px] font-bold uppercase tracking-wider text-[#C9A84C] leading-tight whitespace-nowrap">Find My Dream Car</h2>
                <p className="font-[family-name:var(--font-body)] text-[11px] text-white/60 leading-snug mt-1">
                  Tell us what you want - we&apos;ll source it for you.
                </p>
              </div>
              <div className="shrink-0 ml-3">
                {renderDots(true)}
              </div>
            </div>
            {/* Scrollable form for mobile sheet */}
            <div className="overflow-y-auto flex-1 min-h-0">
              <DreamCarForm {...formProps} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
