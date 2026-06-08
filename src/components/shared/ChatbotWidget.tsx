"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

const WA_PHONE = "971561498485";

/** Builds a WhatsApp link summarising the same details saved to the database. */
function buildWaUrl(form: Record<FormFields, string>) {
  const car = [form.brand, form.model].map(s => s.trim()).filter(Boolean).join(" ");
  const lines = [
    "Hi Wheels2Deals, I just submitted my dream car request and would love to chat about it.",
    "",
    form.fullName.trim() && `Name: ${form.fullName.trim()}`,
    car && `Looking for: ${car}`,
    form.budget.trim() && `Budget: AED ${form.budget.trim()}`,
    form.yearRange.trim() && `Year: ${form.yearRange.trim()}`,
    form.timeline.trim() && `Timeline: ${form.timeline.trim()}`,
    form.notes.trim() && `Notes: ${form.notes.trim()}`,
  ].filter(Boolean);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}
import {
  BUDGET_OPTIONS, YEAR_RANGE_OPTIONS, TIMELINE_OPTIONS,
  useDreamCarForm, type FormFields,
} from "@/components/shared/dreamCar/useDreamCarForm";
import {
  FloatingField, SelectField, BrandField, ModelField,
} from "@/components/shared/dreamCar/DreamCarFields";

// ── Typewriter nudge text ─────────────────────────────────────────────────────

const NUDGE_SEGMENTS: { text: string; gold?: boolean }[] = [
  { text: "Find your " },
  { text: "dream car", gold: true },
  { text: " - now!" },
];

function NudgeText({ play }: { play: boolean }) {
  // Split into per-code-point chars (keeps the emoji intact) tagged by colour
  const chars = useMemo(
    () => NUDGE_SEGMENTS.flatMap(s => Array.from(s.text).map(ch => ({ ch, gold: !!s.gold }))),
    [],
  );
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!play) { setN(0); return; }
    let i = 0;
    let interval: number | undefined;
    // Let the bubble settle from its entrance, then type the message out
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setN(i);
        if (i >= chars.length) window.clearInterval(interval);
      }, 45);
    }, 300);
    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, [play, chars.length]);

  const done = n >= chars.length;

  return (
    <span className="block whitespace-nowrap font-[family-name:var(--font-body)] text-[13px] font-medium leading-none tracking-[0.01em]">
      {chars.slice(0, n).map((c, i) => (
        <span key={i} className={c.gold ? "font-bold text-[#C9A84C]" : "text-white/85"}>{c.ch}</span>
      ))}
      {!done && (
        <span className="ml-px inline-block h-[12px] w-[2px] -mb-px animate-pulse rounded-full bg-[#C9A84C] align-middle" />
      )}
    </span>
  );
}

// ── Chat-styled body for the Find-My-Dream-Car form ───────────────────────────

function ChatBody() {
  const {
    form, phase, phoneError, submitted, loading, brandFromList,
    update, setBrandFromList, handleSubmit, reset,
  } = useDreamCarForm({ autoResetMs: null });

  const bubble = "animate-in slide-in-from-bottom-2 fade-in duration-300";

  // Auto-scroll the thread to reveal newly unlocked fields
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [phase, submitted]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 flex flex-col gap-4">

        {/* Assistant greeting bubble */}
        <div className={`flex gap-2.5 ${bubble}`}>
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A3510]">
            <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#2A3510] px-4 py-3">
            <p className="font-[family-name:var(--font-body)] text-[12.5px] leading-relaxed text-white/90">
              Hi 👋 Welcome to <span className="font-semibold text-[#C9A84C]">Wheels2Deals</span>.
              Tell me the car you&apos;re after and we&apos;ll source it for you.
            </p>
          </div>
        </div>

        {submitted ? (
          <>
            <div className={`flex gap-2.5 ${bubble}`}>
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A3510]">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-[#C9A84C]/30 bg-[#FBF8F2] px-4 py-3">
                <p className="font-[family-name:var(--font-display)] text-[13px] font-bold uppercase tracking-wide text-[#2A3510]">
                  Request received 🎉
                </p>
                <p className="mt-1 font-[family-name:var(--font-body)] text-[12px] leading-relaxed text-[#6B6560]">
                  Our team will reach out on WhatsApp shortly with matching cars.
                </p>
              </div>
            </div>

            {/* Follow-up message: urgent WhatsApp support */}
            <div className={`flex gap-2.5 ${bubble}`} style={{ animationDelay: "450ms", animationFillMode: "both" }}>
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2A3510]">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A84C]" />
              </div>
              <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[#2A3510] px-4 py-3.5">
                <p className="font-[family-name:var(--font-body)] text-[12.5px] leading-relaxed text-white/90">
                  Prefer to talk it through? Continue this request on WhatsApp.
                </p>
                <a
                  href={buildWaUrl(form)}
                  target="_blank"
                  rel="noopener nofollow"
                  className="group/wa mt-3 flex items-center gap-3 rounded-2xl bg-[#25D366] px-3.5 py-3 transition-all duration-200 hover:bg-[#22c35e] active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                    <FaWhatsapp className="h-[22px] w-[22px] text-[#25D366]" />
                  </span>
                  <span className="min-w-0 flex-1 font-[family-name:var(--font-body)] text-[13px] font-bold text-white">
                    Chat on WhatsApp
                  </span>
                  <Send size={14} className="shrink-0 -rotate-90 text-white/80 transition-transform duration-200 group-hover/wa:translate-x-0.5" />
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="group/again mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full border border-white/15 py-2.5 font-[family-name:var(--font-body)] text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/60 transition-all duration-200 hover:border-[#C9A84C]/40 hover:bg-white/5 hover:text-[#C9A84C] active:scale-[0.98]"
                >
                  <RotateCcw size={12} className="transition-transform duration-500 group-hover/again:-rotate-180" />
                  Start a new request
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Form fields flow directly in the chat thread (no nested card) */
          <div className={`flex flex-col gap-y-3.5 px-0.5 ${bubble}`}>
              <FloatingField label="Full Name" required value={form.fullName} onChange={update("fullName")} />
              <FloatingField label="Phone Number" required type="tel" value={form.phone} onChange={update("phone")} error={phoneError} />
              <BrandField value={form.brand} onChange={update("brand")} onFromList={setBrandFromList} />

              {phase >= 2 && (
                <>
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationFillMode: "both" }}>
                    <ModelField value={form.model} onChange={update("model")} brand={form.brand} brandFromList={brandFromList} />
                  </div>
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: "70ms", animationFillMode: "both" }}>
                    <SelectField label="Budget (AED)" required value={form.budget} onChange={update("budget")} options={BUDGET_OPTIONS} />
                  </div>
                </>
              )}

              {phase >= 3 && (
                <>
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationFillMode: "both" }}>
                    <SelectField label="Year Range" value={form.yearRange} onChange={update("yearRange")} options={YEAR_RANGE_OPTIONS} />
                  </div>
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: "70ms", animationFillMode: "both" }}>
                    <SelectField label="When do you need it?" value={form.timeline} onChange={update("timeline")} options={TIMELINE_OPTIONS} />
                  </div>
                  <div className="animate-in slide-in-from-bottom-2 fade-in duration-300" style={{ animationDelay: "140ms", animationFillMode: "both" }}>
                    <FloatingField label="Anything specific?" value={form.notes} onChange={update("notes")} placeholder="color, features, trade-in" />
                  </div>
                </>
              )}
          </div>
        )}
      </div>

      {/* Composer / submit */}
      {!submitted && (
        <div className="shrink-0 border-t border-[#EAE6DF] bg-white px-4 py-3">
          <button
            type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#2A3510] py-3 font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-[#3A4A20] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} className="text-[#C9A84C]" />}
            {loading ? "Sending..." : "Send request"}
          </button>
        </div>
      )}
    </form>
  );
}

// ── Launcher + panel ──────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);

  // Tease the chat with a message pill a moment after load
  useEffect(() => {
    if (typeof window === "undefined") return;
    // TODO: re-enable once-per-session suppression after the design is approved
    // if (sessionStorage.getItem("w2d_chat_nudge") === "dismissed") return;
    const t = window.setTimeout(() => setNudge(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const dismissNudge = () => {
    setNudge(false);
    try { sessionStorage.setItem("w2d_chat_nudge", "dismissed"); } catch {}
  };

  // Thumb drag-to-dismiss for the mobile full-screen sheet
  const [dragY, setDragY] = useState(0);
  const dragStartRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const closePanel = () => { setOpen(false); setDragY(0); dragStartRef.current = null; };

  // Close when clicking outside the panel (desktop) — ignore the launcher and dropdown popovers
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (launcherRef.current?.contains(t)) return;
      if ((t as Element)?.closest?.("[data-chat-keep-open]")) return;
      closePanel();
    };
    const id = window.setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { window.clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [open]);

  const onDragStart = (e: React.TouchEvent) => { dragStartRef.current = e.touches[0].clientY; };
  const onDragMove = (e: React.TouchEvent) => {
    if (dragStartRef.current === null) return;
    const d = e.touches[0].clientY - dragStartRef.current;
    if (d > 0) setDragY(d);
  };
  const onDragEnd = () => {
    if (dragY > 110) { closePanel(); return; }
    setDragY(0);
    dragStartRef.current = null;
  };

  // Lock body scroll on mobile while the panel is open
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Available on every page except admin routes
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={closePanel}
        />
      )}

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed z-[301] flex flex-col overflow-hidden bg-[#F4F1EB] shadow-[0_24px_70px_rgba(42,53,16,0.32)] transition-all duration-300 ease-out
          inset-0 h-[100dvh] rounded-none
          sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-[calc(100vh-140px)] sm:w-[372px] sm:rounded-[24px] sm:border sm:border-[#2A3510]/10
          ${open ? "pointer-events-auto translate-y-0 opacity-100 sm:scale-100" : "pointer-events-none translate-y-full opacity-0 sm:translate-y-3 sm:scale-95"}`}
        style={{
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragStartRef.current !== null ? "none" : undefined,
        }}
        aria-hidden={!open}
      >
        {/* Header (doubles as the drag handle on mobile) */}
        <div
          className="relative shrink-0 overflow-hidden bg-[#2A3510] px-5 pt-6 pb-4 sm:pt-5 sm:touch-auto touch-none select-none"
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
        >
          {/* drag handle pill (mobile only) */}
          <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30 sm:hidden" />
          {/* gold glow */}
          <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#C9A84C]/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <img src="/logo-circle.png" alt="Wheels2Deals" className="h-11 w-11 rounded-full border border-[#C9A84C]/40 object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#2A3510] bg-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-[family-name:var(--font-display)] text-[15px] font-bold uppercase tracking-wide text-[#C9A84C] leading-tight">
                Find My Dream Car
              </p>
              <p className="font-[family-name:var(--font-body)] text-[10.5px] text-white/55">
                Online · replies instantly
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Conversation */}
        <ChatBody />
      </div>

      {/* Chat nudge pill — Telegram/Instagram style teaser */}
      {nudge && !open && (
        <div className="fixed bottom-[150px] right-5 sm:bottom-[94px] z-[97] animate-in slide-in-from-bottom-3 fade-in zoom-in-95 duration-500 ease-out">
          <div className="relative">
            <button
              type="button"
              onClick={() => { setOpen(true); dismissNudge(); }}
              className="group/nudge relative block w-max max-w-[260px] overflow-hidden rounded-[20px] bg-[#2A3510] px-4 py-3 text-left shadow-[0_16px_40px_-8px_rgba(42,53,16,0.55)] ring-1 ring-[#C9A84C]/20 transition-shadow duration-300 hover:shadow-[0_20px_48px_-8px_rgba(42,53,16,0.6)]"
            >
              {/* soft gold glow */}
              <span className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-[#C9A84C]/15 blur-2xl" />
              <span className="relative block">
                <NudgeText play={nudge && !open} />
              </span>
            </button>
            {/* tail at the side corner, pointing down to the launcher */}
            <span className="absolute -bottom-[4px] right-3 h-3 w-3 rotate-45 rounded-[2px] bg-[#2A3510]" />
            {/* dismiss */}
            <button
              type="button"
              onClick={dismissNudge}
              aria-label="Dismiss"
              className="absolute -right-2 -top-2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2A3510] text-[#C9A84C] shadow-[0_4px_12px_rgba(0,0,0,0.22)] ring-1 ring-[#C9A84C]/30 transition-transform duration-200 hover:scale-110"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Launcher button */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => { setOpen(o => !o); setNudge(false); }}
        aria-label={open ? "Close chat" : "Open dream car chat"}
        aria-expanded={open}
        className={`group fixed bottom-20 sm:bottom-6 right-6 z-[97] h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2A3510] shadow-[0_12px_34px_rgba(42,53,16,0.4)] border border-[#C9A84C]/30 transition-transform duration-300 hover:scale-105 active:scale-95 ${open ? "hidden sm:flex" : "flex"}`}
      >
        {!open && (
          <span className="absolute inset-0 -z-10 rounded-full bg-[#C9A84C]/25 animate-ping" style={{ animationDuration: "2.4s" }} />
        )}
        <span className="relative flex items-center justify-center">
          {open ? (
            <X className="h-6 w-6 text-[#C9A84C] transition-transform duration-300" />
          ) : (
            <img src="/chat-icon.svg" alt="" className="h-[26px] w-[26px] transition-transform duration-300 group-hover:scale-110" />
          )}
        </span>
      </button>
    </>
  );
}
