"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import { Trash2, Star, Inbox, X, Phone, PanelRightOpen, ChevronRight, RotateCcw } from "lucide-react";
import {
  updateDreamCarStatus, deleteDreamCarRequest,
  restoreDreamCarRequest, permanentDeleteDreamCarRequest,
  type DreamCarStatus,
} from "@/app/(admin)/actions/dream-car-request";

export type DreamCarRow = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  brand: string;
  model: string | null;
  budget: string | null;
  year_range: string | null;
  timeline: string | null;
  notes: string | null;
  status: DreamCarStatus;
  deleted_at: string | null;
};

const STATUS_CONFIG: Record<DreamCarStatus, { badge: string; label: string; next: DreamCarStatus | null; nextLabel: string | null }> = {
  new:       { badge: "bg-sky-50 text-sky-700 border border-sky-200",         label: "New",       next: "contacted", nextLabel: "Mark Contacted" },
  contacted: { badge: "bg-amber-50 text-amber-700 border border-amber-200",   label: "Contacted", next: "fulfilled", nextLabel: "Mark Fulfilled" },
  fulfilled: { badge: "bg-[#F0F3E8] text-[#3A4A20] border border-[#C8D0B0]", label: "Fulfilled", next: null,        nextLabel: null             },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function waHref(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

// ─── Detail field block ────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#F6F5F1] rounded-xl px-4 py-3 shrink-0">
      <p className="font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-0.5">
        {label}
      </p>
      <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510] leading-snug">
        {value}
      </p>
    </div>
  );
}

// ─── Detail drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({
  req,
  onClose,
  onAdvance,
  onDelete,
  onRestore,
  onPermanentDelete,
  busy,
}: {
  req: DreamCarRow;
  onClose: () => void;
  onAdvance: (req: DreamCarRow) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  busy: boolean;
}) {
  const isDeleted = !!req.deleted_at;
  const cfg = STATUS_CONFIG[req.status];
  const { date, time } = formatDate(req.created_at);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-white z-[110] shadow-[-32px_0_80px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300 ease-out">

        {/* ── HERO ── */}
        <div className="relative h-[140px] shrink-0 bg-[#2A3510] flex flex-col justify-end px-5 pb-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.15),transparent_70%)]" />
          {/* badge */}
          <span className="absolute top-4 left-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.1em] uppercase bg-white/10 text-white border border-white/20">
            <Star size={9} strokeWidth={2.5} className="text-white/70" />
            Concierge Request
          </span>
          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            <X size={15} strokeWidth={2} className="text-white" />
          </button>
          {/* hero text */}
          <div className="relative z-10">
            <p className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-white leading-tight">
              {req.brand}{req.model ? ` · ${req.model}` : ""}
            </p>
            <p className="font-[family-name:var(--font-body)] text-[13px] text-white/50 mt-0.5">
              {date} · {time}
            </p>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-3 overflow-hidden">

          {/* Contact */}
          <a
            href={waHref(req.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#F0F3E8] rounded-xl px-4 py-3 no-underline hover:bg-[#E4EBCE] transition-colors shrink-0"
          >
            <Phone size={16} strokeWidth={1.8} className="text-[#4A6020] shrink-0" />
            <div>
              <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#7A9040] mb-0.5">
                Phone / WhatsApp
              </p>
              <p className="font-[family-name:var(--font-body)] text-[14px] font-semibold text-[#2A3510]">
                {req.phone}
              </p>
            </div>
            <ChevronRight size={14} strokeWidth={2} className="text-[#7A9040] ml-auto" />
          </a>

          {/* Name */}
          <Field label="Full Name" value={req.full_name} />

          {/* Car details grid */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <Field label="Brand" value={req.brand} />
            {req.model      && <Field label="Model / Variant"       value={req.model} />}
            {req.budget     && <Field label="Budget (AED)"          value={req.budget} />}
            {req.year_range && <Field label="Year Range"            value={req.year_range} />}
          </div>

          {req.timeline && <Field label="When do you need it?" value={req.timeline} />}
          {req.notes    && <Field label="Notes"                value={req.notes} />}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status */}
          <div className="flex items-center justify-between py-3 border-t border-[#EDEAE6] shrink-0">
            <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.15em] uppercase text-[#666666]">
              Status
            </span>
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase ${cfg.badge}`}>
                {cfg.label}
              </span>
              {cfg.nextLabel && (
                <button
                  onClick={() => onAdvance(req)}
                  disabled={busy}
                  className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.06em] uppercase text-[#3A4A20] hover:text-[#2A3510] border-none bg-transparent cursor-pointer transition-colors disabled:opacity-40"
                >
                  {cfg.nextLabel} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="shrink-0 px-5 py-4 border-t border-[#EDEAE6] flex items-center gap-3">
          {isDeleted ? (
            <>
              <button
                onClick={() => onPermanentDelete(req.id)}
                disabled={busy}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                title="Delete permanently"
              >
                <Trash2 size={15} strokeWidth={1.8} className="text-red-500" />
              </button>
              <button
                onClick={() => onRestore(req.id)}
                disabled={busy}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#2A3510] text-white font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.08em] uppercase hover:bg-[#3A4A20] transition-colors disabled:opacity-40 cursor-pointer border-none"
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onDelete(req.id)}
                disabled={busy}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                title="Move to deleted"
              >
                <Trash2 size={15} strokeWidth={1.8} className="text-red-500" />
              </button>

              <a
                href={waHref(req.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.08em] uppercase hover:bg-[#1fbd5a] transition-colors no-underline"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type StatusFilter = DreamCarStatus | "all" | "deleted";

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "new",       label: "New"       },
  { key: "contacted", label: "Contacted" },
  { key: "deleted",   label: "Deleted"   },
];

export default function DreamCarRequestsTable({ requests }: { requests: DreamCarRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const active = requests.filter(r => !r.deleted_at);

  const counts = {
    all:       active.length,
    new:       active.filter(r => r.status === "new").length,
    contacted: active.filter(r => r.status === "contacted").length,
    fulfilled: active.filter(r => r.status === "fulfilled").length,
    deleted:   requests.filter(r => r.deleted_at).length,
  };

  const filtered =
    filter === "deleted" ? requests.filter(r => r.deleted_at)
    : filter === "all"   ? active
    : active.filter(r => r.status === filter);
  const selected = requests.find(r => r.id === selectedId) ?? null;

  function advanceStatus(req: DreamCarRow) {
    const next = STATUS_CONFIG[req.status].next;
    if (!next) return;
    setActionId(req.id);
    startTransition(async () => {
      await updateDreamCarStatus(req.id, next);
      router.refresh();
      setActionId(null);
    });
  }

  function handleDelete(id: string) {
    setSelectedId(null);
    setActionId(id);
    startTransition(async () => {
      await deleteDreamCarRequest(id);
      router.refresh();
      setActionId(null);
    });
  }

  function handleRestore(id: string) {
    setSelectedId(null);
    setActionId(id);
    startTransition(async () => {
      await restoreDreamCarRequest(id);
      router.refresh();
      setActionId(null);
    });
  }

  function handlePermanentDelete(id: string) {
    if (!confirm("Permanently delete this request? This cannot be undone.")) return;
    setSelectedId(null);
    setActionId(id);
    startTransition(async () => {
      await permanentDeleteDreamCarRequest(id);
      router.refresh();
      setActionId(null);
    });
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888] mb-1">
            Concierge
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Dream Car Requests
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888] mt-0.5">
            Submissions from the &ldquo;Find My Dream Car&rdquo; concierge form
          </p>
        </div>
        {counts.new > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 border border-sky-200">
            <Star size={13} strokeWidth={2} className="text-sky-600" />
            <span className="font-[family-name:var(--font-body)] text-[12px] font-bold text-sky-700">
              {counts.new} new
            </span>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["new", "contacted", "fulfilled"] as const).map(s => (
          <div key={s} className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888] mb-2">
              {s}
            </p>
            <p className={`font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none ${
              s === "new" ? "text-sky-700" : s === "contacted" ? "text-amber-700" : "text-[#3A4A20]"
            }`}>
              {counts[s]}
            </p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        {/* Filter tabs */}
        <div className="px-5 py-3.5 border-b border-[#EDEAE6] flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setSelectedId(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.04em] transition-colors cursor-pointer border-none ${
                  filter === key
                    ? "bg-[#2A3510] text-white"
                    : "bg-[#F6F5F1] text-[#888] hover:text-[#2A3510] hover:bg-[#EDEAE6]"
                }`}
              >
                {label}
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                  filter === key ? "bg-white/20 text-white" : "bg-[#E0DDD8] text-[#888]"
                }`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>
          <span className="font-[family-name:var(--font-body)] text-[11px] text-[#888]">
            {filtered.length} shown
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <Inbox size={32} strokeWidth={1.2} className="text-[#CCCCCC]" />
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888]">No requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DDD8] bg-[#F6F5F1]">
                  {["", "Name", "Phone", "Brand", "Model", "Budget (AED)", "Date", "Status", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[#888] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => {
                  const cfg = STATUS_CONFIG[req.status];
                  const isSelected = selectedId === req.id;
                  const busy = actionId === req.id;
                  const { date, time } = formatDate(req.created_at);

                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedId(isSelected ? null : req.id)}
                      className={`border-b border-[#EDEAE6] last:border-0 transition-colors cursor-pointer group ${
                        isSelected ? "bg-[#E8EDD8]" : "hover:bg-[#EDF1E3]"
                      }`}
                    >
                      {/* Open drawer icon */}
                      <td className="pl-4 pr-1 py-4" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedId(isSelected ? null : req.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-[#D8E4B8] border-none transition-all cursor-pointer"
                          title="Open details"
                        >
                          <PanelRightOpen size={14} strokeWidth={1.8} className="text-[#4A6020]" />
                        </button>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <p className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510] leading-tight">{req.full_name}</p>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <a
                          href={waHref(req.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[12.5px] text-[#25D366] hover:text-[#1fbd5a] transition-colors no-underline font-medium"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5" />
                          {req.phone}
                        </a>
                      </td>

                      {/* Brand */}
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555]">{req.brand}</span>
                      </td>

                      {/* Model */}
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555]">
                          {req.model || <span className="text-[#CCC]">-</span>}
                        </span>
                      </td>

                      {/* Budget */}
                      <td className="px-5 py-4">
                        <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555]">
                          {req.budget || <span className="text-[#CCC]">-</span>}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888]">{date}</span>
                        <p className="font-[family-name:var(--font-body)] text-[11px] text-[#BBBBBB]">{time}</p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Delete / Restore */}
                      <td className="px-4 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        {req.deleted_at ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRestore(req.id)}
                              disabled={busy}
                              className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-[#E4EBCE] border-none transition-all cursor-pointer disabled:opacity-40"
                              title="Restore request"
                            >
                              <RotateCcw size={14} strokeWidth={1.8} className="text-[#4A6020]" />
                            </button>
                            <button
                              onClick={() => handlePermanentDelete(req.id)}
                              disabled={busy}
                              className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-50 border-none transition-all cursor-pointer disabled:opacity-40"
                              title="Delete permanently"
                            >
                              <Trash2 size={14} strokeWidth={1.8} className="text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(req.id)}
                            disabled={busy}
                            className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-50 border-none transition-all cursor-pointer disabled:opacity-40"
                            title="Move to deleted"
                          >
                            <Trash2 size={14} strokeWidth={1.8} className="text-red-400" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer
          req={selected}
          onClose={() => setSelectedId(null)}
          onAdvance={advanceStatus}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          busy={actionId === selected.id}
        />
      )}
    </div>
  );
}
