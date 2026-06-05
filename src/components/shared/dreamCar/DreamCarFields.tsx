"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

// ── Shared floating text input ────────────────────────────────────────────────

export function FloatingField({ label, required = false, value, onChange, type = "text", placeholder, error }: {
  label: string; required?: boolean; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; error?: string | null;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || !!value;
  return (
    <div className="relative shrink-0 flex flex-col gap-1">
      <div className="relative pt-4">
        <label className={[
          "absolute left-0 pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)] whitespace-nowrap",
          floated
            ? "top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
            : "top-[13px] text-[16px] text-[#2A3510]",
        ].join(" ")}>
          {label}{required && <span className="ml-0.5 text-[#2A3510]/50">*</span>}
        </label>
        <div className="flex items-center gap-2 border-b transition-colors duration-200 w-full"
             style={{ borderColor: error ? "#F87171" : focused ? "#2A3510" : "#DDD7CE" }}>
          <input
            type={type}
            inputMode={type === "tel" ? "tel" : undefined}
            value={value}
            onChange={e => {
              const v = type === "tel" ? e.target.value.replace(/[^\d+\s()-]/g, "") : e.target.value;
              onChange(v);
            }}
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

function DropdownPortal({ triggerRect, onClose, ignoreRef, children }: {
  triggerRect: DOMRect; onClose: () => void; ignoreRef?: React.RefObject<HTMLElement | null>; children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      if (ignoreRef?.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, ignoreRef]);

  // Flip the panel above the trigger when there isn't enough room below it
  const GAP = 6;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
  const maxHeight = Math.min(240, (openUp ? spaceAbove : spaceBelow) - GAP - 8);

  return createPortal(
    <div
      ref={ref}
      data-lenis-prevent
      data-chat-keep-open
      className="fixed z-[9999] rounded-2xl border border-[#E5DDD0] bg-[#FBF8F2] shadow-[0_16px_40px_rgba(42,53,16,0.14)] overflow-hidden flex flex-col"
      onWheel={e => e.stopPropagation()}
      style={{
        ...(openUp
          ? { bottom: window.innerHeight - triggerRect.top + GAP }
          : { top: triggerRect.bottom + GAP }),
        right: window.innerWidth - triggerRect.right,
        width: triggerRect.width,
        maxHeight,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// ── SelectField — static option list (Budget, Year Range, Timeline) ────────────

export function SelectField({ label, required = false, value, onChange, options }: {
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

// ── BrandField — combobox: type in the field to search, pick from the list ─────

export function BrandField({ value, onChange, onFromList }: {
  value: string; onChange: (v: string) => void; onFromList: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [makes, setMakes] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const floated = focused || !!value;

  useEffect(() => {
    fetch("/api/car-makes").then(r => r.json()).then(d => setMakes(d.makes ?? [])).catch(() => {});
  }, []);

  const filtered = value.trim() ? makes.filter(m => m.toLowerCase().includes(value.toLowerCase())) : makes;
  const showCustom = value.trim() && !makes.some(m => m.toLowerCase() === value.trim().toLowerCase());

  function openDropdown() {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(true);
  }

  function selectMake(make: string) {
    onChange(make); onFromList(true); setOpen(false);
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <div className="relative pt-4">
        <label className={[
          "absolute left-0 pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)]",
          floated
            ? "top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
            : "top-[13px] text-[16px] text-[#2A3510]",
        ].join(" ")}>
          Brand<span className="ml-0.5 text-[#2A3510]/50">*</span>
        </label>
        <div className={`flex items-center gap-2 border-b transition-colors duration-200 w-full ${open || focused ? "border-[#2A3510]" : "border-[#DDD7CE]"}`}>
          <input
            type="text"
            value={value}
            onChange={e => { onChange(e.target.value); onFromList(false); openDropdown(); }}
            onFocus={() => { setFocused(true); openDropdown(); }}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent pb-1.5 outline-none text-[16px] text-[#2A3510] font-[family-name:var(--font-body)] border-none"
          />
          <ChevronDown
            size={13} strokeWidth={2}
            onMouseDown={e => { e.preventDefault(); open ? setOpen(false) : openDropdown(); }}
            className={`text-[#AAA49C] shrink-0 cursor-pointer transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {open && rect && (
        <DropdownPortal triggerRect={rect} onClose={close} ignoreRef={ref}>
          <div className="overflow-y-auto flex-1" onWheel={e => e.stopPropagation()}>
            {filtered.slice(0, 80).map(m => (
              <button key={m} type="button" onMouseDown={e => { e.preventDefault(); selectMake(m); }}
                className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] transition-colors flex items-center justify-between ${
                  value === m ? "bg-[#2A3510]/8 text-[#2A3510] font-semibold" : "text-[#555] hover:bg-[#2A3510]/5 hover:text-[#2A3510]"
                }`}>
                {m}{value === m && <Check size={12} strokeWidth={2.5} className="text-[#2A3510]" />}
              </button>
            ))}
            {showCustom && (
              <button type="button" onMouseDown={e => { e.preventDefault(); onFromList(false); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] text-[#888] italic hover:bg-[#2A3510]/5 hover:text-[#2A3510] border-t border-[#EAE6DF]">
                Use &ldquo;{value.trim()}&rdquo;
              </button>
            )}
            {filtered.length === 0 && !showCustom && (
              <p className="px-4 py-3 font-[family-name:var(--font-body)] text-[12px] text-[#AAA49C]">No matches</p>
            )}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}

// ── ModelField — dropdown if brand from list, plain input if custom ────────────

export function ModelField({ value, onChange, brand, brandFromList }: {
  value: string; onChange: (v: string) => void; brand: string; brandFromList: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [models, setModels] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!brand || !brandFromList) { setModels([]); return; }
    fetch(`/api/car-models?make=${encodeURIComponent(brand)}`)
      .then(r => r.json()).then(d => setModels(d.models ?? [])).catch(() => setModels([]));
  }, [brand, brandFromList]);

  if (!brandFromList) {
    return <FloatingField label="Model / Variant" required value={value} onChange={onChange} />;
  }

  const filtered = value.trim() ? models.filter(m => m.toLowerCase().includes(value.toLowerCase())) : models;
  const showCustom = value.trim() && !models.some(m => m.toLowerCase() === value.trim().toLowerCase());
  const floated = focused || !!value;

  function openDropdown() {
    if (ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(true);
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <div className="relative pt-4">
        <label className={[
          "absolute left-0 pointer-events-none transition-all duration-200 font-[family-name:var(--font-body)]",
          floated
            ? "top-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2A3510]"
            : "top-[13px] text-[16px] text-[#2A3510]",
        ].join(" ")}>
          Model / Variant<span className="ml-0.5 text-[#2A3510]/50">*</span>
        </label>
        <div className={`flex items-center gap-2 border-b transition-colors duration-200 w-full ${open || focused ? "border-[#2A3510]" : "border-[#DDD7CE]"}`}>
          <input
            type="text"
            value={value}
            onChange={e => { onChange(e.target.value); openDropdown(); }}
            onFocus={() => { setFocused(true); openDropdown(); }}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent pb-1.5 outline-none text-[16px] text-[#2A3510] font-[family-name:var(--font-body)] border-none"
          />
          <ChevronDown
            size={13} strokeWidth={2}
            onMouseDown={e => { e.preventDefault(); open ? setOpen(false) : openDropdown(); }}
            className={`text-[#AAA49C] shrink-0 cursor-pointer transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {open && rect && (
        <DropdownPortal triggerRect={rect} onClose={close} ignoreRef={ref}>
          <div className="overflow-y-auto flex-1" onWheel={e => e.stopPropagation()}>
            {models.length === 0 && (
              <p className="px-4 py-3 font-[family-name:var(--font-body)] text-[12px] text-[#AAA49C]">Loading models...</p>
            )}
            {filtered.slice(0, 80).map(m => (
              <button key={m} type="button" onMouseDown={e => { e.preventDefault(); onChange(m); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] transition-colors flex items-center justify-between ${
                  value === m ? "bg-[#2A3510]/8 text-[#2A3510] font-semibold" : "text-[#555] hover:bg-[#2A3510]/5 hover:text-[#2A3510]"
                }`}>
                {m}{value === m && <Check size={12} strokeWidth={2.5} className="text-[#2A3510]" />}
              </button>
            ))}
            {showCustom && models.length > 0 && (
              <button type="button" onMouseDown={e => { e.preventDefault(); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 font-[family-name:var(--font-body)] text-[12.5px] text-[#888] italic hover:bg-[#2A3510]/5 hover:text-[#2A3510] border-t border-[#EAE6DF]">
                Use &ldquo;{value.trim()}&rdquo;
              </button>
            )}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}
