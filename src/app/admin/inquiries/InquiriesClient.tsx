"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateInquiryStatus,
  softDeleteInquiry,
  restoreInquiry,
  permanentDeleteInquiry,
} from "@/app/(admin)/actions/inquiry";
import Link from "next/link";
import {
  Inbox,
  X,
  Phone,
  Mail,
  Car,
  ChevronRight,
  Trash2,
  RotateCcw,
  PanelRightOpen,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import InquiryStatusButton from "../cars/[slug]/InquiryStatusButton";

type CarRef = { title: string; slug: string; images: string[] } | null;

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
  deleted_at: string | null;
  car_id: string | null;
  cars: CarRef;
};

type InquiryType = "buy" | "sell" | "contact";
type FilterType = InquiryType | "all" | "trash";

function daysLeft(deletedAt: string): number {
  const expiry = new Date(deletedAt).getTime() + 15 * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expiry - Date.now()) / (24 * 60 * 60 * 1000)));
}

function getType(inq: InquiryRow): InquiryType {
  if (inq.car_id) return "buy";
  if (inq.name === "Valuation Request") return "sell";
  return "contact";
}

const TYPE_CONFIG: Record<
  InquiryType,
  { label: string; badge: string; dot: string }
> = {
  buy: {
    label: "Buy Inquiry",
    badge: "bg-sky-50 text-sky-700 border border-sky-200",
    dot: "bg-sky-500",
  },
  sell: {
    label: "Sell Valuation",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-500",
  },
  contact: {
    label: "Contact",
    badge: "bg-[#F6F5F1] text-[#666] border border-[#E0DDD8]",
    dot: "bg-[#AAAAAA]",
  },
};

const STATUS_BADGE: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border border-sky-200",
  contacted: "bg-amber-50 text-amber-700 border border-amber-200",
  closed: "bg-[#F0F3E8] text-[#3A4A20] border border-[#C8D0B0]",
};

function parseSellMessage(message: string | null): Record<string, string> {
  if (!message) return {};
  const lines = message.split("\n").slice(1);
  const result: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx > -1) {
      result[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return result;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function waHref(phone: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({
  inq,
  onClose,
}: {
  inq: InquiryRow;
  onClose: () => void;
}) {
  const type = getType(inq);
  const cfg = TYPE_CONFIG[type];
  const car = inq.cars as CarRef;
  const { date, time } = formatDate(inq.created_at);
  const sellFields = type === "sell" ? parseSellMessage(inq.message) : null;
  const wa = waHref(inq.phone);
  const showEmail = inq.email && inq.email !== "info@wheels2deals.com";
  const router = useRouter();

  async function markContacted() {
    if (inq.status === "contacted" || inq.status === "closed") return;
    await updateInquiryStatus(inq.id, "contacted");
    router.refresh();
  }

  async function handleDelete() {
    await softDeleteInquiry(inq.id);
    onClose();
    router.refresh();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel - fixed height = viewport, no scroll */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-white z-[110] shadow-[-32px_0_80px_rgba(0,0,0,0.12)] flex flex-col animate-in slide-in-from-right duration-300 ease-out">

        {/* ── HERO ── */}
        {type === "buy" ? (
          /* Buy: full car image hero */
          <div className="relative h-[300px] shrink-0 bg-[#E8E4DE]">
            {car?.images?.[0] ? (
              <img
                src={car.images[0]}
                alt={car?.title ?? "Car"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car size={40} strokeWidth={1} className="text-[#CCCCCC]" />
              </div>
            )}
            {/* gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
            {/* type badge - top left */}
            <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.1em] uppercase backdrop-blur-sm ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            {/* close - top right */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors cursor-pointer border-none"
            >
              <X size={15} strokeWidth={2} className="text-white" />
            </button>
            {/* car title + link - bottom */}
            {car && (
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end justify-between gap-3">
                <p className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-white leading-snug line-clamp-2">
                  {car.title}
                </p>
                <Link
                  href={`/admin/cars/${car.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 flex items-center gap-1 font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] uppercase text-[#C9A84C] no-underline hover:text-white transition-colors pb-0.5"
                >
                  View
                  <ChevronRight size={12} strokeWidth={2.5} />
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Sell / Contact: dark branded hero */
          <div className="relative h-[140px] shrink-0 bg-[#2A3510] flex flex-col justify-end px-5 pb-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.18),transparent_70%)]" />
            {/* type badge */}
            <span className={`absolute top-4 left-5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.1em] uppercase ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            {/* close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border-none"
            >
              <X size={15} strokeWidth={2} className="text-white" />
            </button>
            {/* hero text */}
            {type === "sell" ? (
              <div className="relative z-10">
                <p className="font-[family-name:var(--font-display)] text-[22px] font-semibold text-white leading-tight">
                  {sellFields?.["Make & Model"] || sellFields?.Brand || "Valuation Request"}
                </p>
                <p className="font-[family-name:var(--font-body)] text-[13px] text-white/50 mt-1 flex items-center gap-3">
                  {sellFields?.Year && <span>{sellFields.Year}</span>}
                  {(sellFields?.["Kms Driven"] || sellFields?.Mileage) && (
                    <span>{sellFields["Kms Driven"] || sellFields.Mileage} km</span>
                  )}
                  {sellFields?.GCC && <span>{sellFields.GCC}</span>}
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold text-white">
                    {inq.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-[family-name:var(--font-display)] text-[18px] font-semibold text-white leading-tight">
                  {inq.name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── BODY ── */}
        <div className="flex-1 px-5 py-5 flex flex-col gap-5 overflow-hidden">

          {/* Contact row */}
          <div className="flex flex-col gap-3">
            {/* Name + date (buy only - sell/contact show name in hero) */}
            {type === "buy" && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F0F3E8] border border-[#D8DEC8] flex items-center justify-center shrink-0">
                    <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold text-[#2A3510]">
                      {inq.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-[family-name:var(--font-body)] text-[15px] font-semibold text-[#2A3510]">
                    {inq.name}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888] shrink-0">
                  {date} · {time}
                </span>
              </div>
            )}
            {/* date for sell / contact */}
            {type !== "buy" && (
              <p className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
                {date} · {time}
              </p>
            )}

            {/* Email + phone - only for buy / contact */}
            {type !== "sell" && (
              <div className="flex flex-col gap-2.5">
                {showEmail && (
                  <a
                    href={`mailto:${inq.email}`}
                    className="flex items-center gap-2.5 font-[family-name:var(--font-body)] text-[14px] text-[#2A3510] hover:text-[#4A6020] transition-colors no-underline"
                  >
                    <Mail size={15} strokeWidth={1.8} className="text-[#7A8A6A] shrink-0" />
                    {inq.email}
                  </a>
                )}
                {inq.phone && (
                  <a
                    href={`tel:${inq.phone}`}
                    className="flex items-center gap-2.5 font-[family-name:var(--font-body)] text-[14px] text-[#2A3510] hover:text-[#4A6020] transition-colors no-underline"
                  >
                    <Phone size={15} strokeWidth={1.8} className="text-[#7A8A6A] shrink-0" />
                    {inq.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sell vehicle details */}
          {type === "sell" && sellFields && (
            <div className="flex flex-col gap-2">
              {/* Make & Model - full width */}
              <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
                <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-1">
                  Make &amp; Model
                </p>
                <p className="font-[family-name:var(--font-display)] text-[18px] font-semibold text-[#2A3510] leading-tight">
                  {sellFields["Make & Model"] || sellFields.Brand || "-"}
                </p>
              </div>

              {/* Year + Chassis No */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
                  <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-1">
                    Year
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[16px] font-semibold text-[#2A3510]">
                    {sellFields.Year || "-"}
                  </p>
                </div>
                <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
                  <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-1">
                    Chassis No
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[16px] font-semibold text-[#2A3510] truncate">
                    {sellFields["Chassis No"] || "-"}
                  </p>
                </div>
              </div>

              {/* Kms Driven + GCC */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
                  <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-1">
                    Kms Driven
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[16px] font-semibold text-[#2A3510]">
                    {sellFields["Kms Driven"] || sellFields.Mileage || "-"}
                  </p>
                </div>
                <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
                  <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#888888] mb-1">
                    Specs
                  </p>
                  <p className="font-[family-name:var(--font-body)] text-[16px] font-semibold text-[#2A3510]">
                    {sellFields.GCC || "-"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {inq.phone && (
                <a
                  href={`tel:${inq.phone}`}
                  className="flex items-center gap-3 bg-[#F0F3E8] rounded-xl px-4 py-3.5 no-underline hover:bg-[#E4EBCE] transition-colors"
                >
                  <Phone size={16} strokeWidth={1.8} className="text-[#4A6020] shrink-0" />
                  <div>
                    <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.14em] uppercase text-[#7A9040] mb-0.5">
                      Phone Number
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-[15px] font-semibold text-[#2A3510]">
                      {inq.phone}
                    </p>
                  </div>
                </a>
              )}
            </div>
          )}

          {/* Message */}
          {type !== "sell" && inq.message && (
            <div className="bg-[#F6F5F1] rounded-xl px-4 py-3.5">
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[#333333] leading-relaxed line-clamp-4">
                {inq.message}
              </p>
            </div>
          )}

          {/* Spacer pushes status to bottom */}
          <div className="flex-1" />

          {/* Status */}
          <div className="flex items-center justify-between py-3.5 border-t border-[#EDEAE6]">
            <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.15em] uppercase text-[#666666]">
              Status
            </span>
            <InquiryStatusButton inquiryId={inq.id} current={inq.status} />
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="shrink-0 px-5 py-4 border-t border-[#EDEAE6] flex items-center gap-3">
          {/* Delete - left side */}
          <button
            onClick={handleDelete}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer shrink-0"
            title="Move to trash"
          >
            <Trash2 size={15} strokeWidth={1.8} className="text-red-500" />
          </button>

          {/* Spacer */}
          <div className="flex-1 flex gap-3">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                onClick={markContacted}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.08em] uppercase hover:bg-[#1fbd5a] transition-colors no-underline"
              >
                <FaWhatsapp className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            {showEmail && (
              <a
                href={`mailto:${inq.email}`}
                onClick={markContacted}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[#F6F5F1] text-[#2A3510] font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.08em] uppercase hover:bg-[#EDEAE6] transition-colors no-underline border border-[#E0DDD8]"
              >
                <Mail size={14} strokeWidth={1.8} />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "buy", label: "Buy" },
  { key: "sell", label: "Sell" },
  { key: "contact", label: "Contact" },
  { key: "trash", label: "Trash" },
];

export default function InquiriesClient({
  inquiries,
  counts,
}: {
  inquiries: InquiryRow[];
  counts: { new: number; contacted: number; closed: number };
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const active = inquiries.filter((i) => !i.deleted_at);
  const trashed = inquiries.filter((i) => !!i.deleted_at);

  const selectedInquiry = active.find((i) => i.id === selectedId) ?? null;

  const typeCounts: Record<InquiryType, number> = {
    buy: active.filter((i) => getType(i) === "buy").length,
    sell: active.filter((i) => getType(i) === "sell").length,
    contact: active.filter((i) => getType(i) === "contact").length,
  };

  const tabCount = (key: FilterType) => {
    if (key === "all") return active.length;
    if (key === "trash") return trashed.length;
    return typeCounts[key as InquiryType];
  };

  const filtered =
    filter === "trash"
      ? trashed
      : filter === "all"
        ? active
        : active.filter((i) => getType(i) === filter);

  async function handleSoftDelete(id: string) {
    if (selectedId === id) setSelectedId(null);
    await softDeleteInquiry(id);
    router.refresh();
  }

  async function handleRestore(id: string) {
    await restoreInquiry(id);
    router.refresh();
  }

  async function handlePermDelete(id: string) {
    await permanentDeleteInquiry(id);
    router.refresh();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
          Inquiries
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mt-0.5">
          All inquiries across buy, sell &amp; contact forms
        </p>
      </div>

      {/* Summary cards - hidden in trash view */}
      {filter !== "trash" && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(["new", "contacted", "closed"] as const).map((s) => (
            <div
              key={s}
              className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4"
            >
              <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888] mb-2">
                {s}
              </p>
              <p
                className={`font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none ${
                  s === "new" ? "text-sky-700" : s === "contacted" ? "text-amber-700" : "text-[#3A4A20]"
                }`}
              >
                {counts[s]}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Trash info banner */}
      {filter === "trash" && trashed.length > 0 && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3.5">
          <Trash2 size={15} strokeWidth={1.8} className="text-red-400 shrink-0" />
          <p className="font-[family-name:var(--font-body)] text-[12.5px] text-red-600">
            Items in trash are permanently deleted after <span className="font-semibold">15 days</span>.
          </p>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        {/* Filter tabs */}
        <div className="px-5 py-3.5 border-b border-[#EDEAE6] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            {FILTER_TABS.map(({ key, label }) => {
              const count = tabCount(key);
              const isTrash = key === "trash";
              return (
                <button
                  key={key}
                  onClick={() => { setFilter(key); setSelectedId(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.05em] transition-colors cursor-pointer border-none ${
                    filter === key
                      ? isTrash
                        ? "bg-red-500 text-white"
                        : "bg-[#2A3510] text-white"
                      : isTrash
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-[#F6F5F1] text-[#888888] hover:text-[#2A3510] hover:bg-[#EDEAE6]"
                  }`}
                >
                  {isTrash && <Trash2 size={11} strokeWidth={2} />}
                  {label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                      filter === key
                        ? "bg-white/20 text-white"
                        : isTrash
                          ? "bg-red-100 text-red-500"
                          : "bg-[#E0DDD8] text-[#888888]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <span className="font-[family-name:var(--font-body)] text-[11px] text-[#888888]">
            {filtered.length} shown
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            {filter === "trash"
              ? <Trash2 size={32} strokeWidth={1.2} className="text-[#CCCCCC]" />
              : <Inbox size={32} strokeWidth={1.2} className="text-[#CCCCCC]" />
            }
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888]">
              {filter === "trash" ? "Trash is empty." : "No inquiries found."}
            </p>
          </div>
        ) : filter === "trash" ? (
          /* ── TRASH TABLE ── */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DDD8] bg-red-50/60">
                  {["Type", "Contact", "Vehicle / Details", "Deleted", "Expires in", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[#888888] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => {
                  const type = getType(inq);
                  const cfg = TYPE_CONFIG[type];
                  const car = inq.cars as CarRef;
                  const sellFields = type === "sell" ? parseSellMessage(inq.message) : null;
                  const { date } = formatDate(inq.created_at);
                  const remaining = daysLeft(inq.deleted_at!);

                  return (
                    <tr
                      key={inq.id}
                      className="border-b border-[#EDEAE6] last:border-0 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {/* Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {type}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        {type === "sell" ? (
                          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888]">{inq.phone ?? "-"}</p>
                        ) : (
                          <>
                            <p className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#888888] leading-tight">{inq.name}</p>
                            <p className="font-[family-name:var(--font-body)] text-[11.5px] text-[#AAAAAA]">{inq.email}</p>
                          </>
                        )}
                      </td>

                      {/* Vehicle / Details */}
                      <td className="px-5 py-4 max-w-[200px]">
                        {type === "buy" && car ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-7 rounded overflow-hidden bg-[#F6F5F1] shrink-0 border border-[#E0DDD8]">
                              {car.images?.[0]
                                ? <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover opacity-60" />
                                : <div className="w-full h-full flex items-center justify-center"><Car size={12} className="text-[#CCCCCC]" /></div>
                              }
                            </div>
                            <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888] line-clamp-1">{car.title}</span>
                          </div>
                        ) : type === "sell" && sellFields ? (
                          <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
                            {[sellFields.Brand, sellFields.Year].filter(Boolean).join(" · ") || "-"}
                          </span>
                        ) : (
                          <span className="font-[family-name:var(--font-body)] text-[12px] text-[#BBBBBB] line-clamp-1">{inq.message || "-"}</span>
                        )}
                      </td>

                      {/* Deleted date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#AAAAAA]">{date}</span>
                      </td>

                      {/* Days left */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] ${
                          remaining <= 3
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-[#F6F5F1] text-[#888888] border border-[#E0DDD8]"
                        }`}>
                          {remaining}d left
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore(inq.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F3E8] text-[#2A3510] font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase hover:bg-[#E0E8C8] transition-colors cursor-pointer border-none"
                          >
                            <RotateCcw size={11} strokeWidth={2.5} />
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermDelete(inq.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
                          >
                            <Trash2 size={11} strokeWidth={2.5} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── ACTIVE TABLE ── */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DDD8] bg-[#F6F5F1]">
                  {["", "Type", "Contact", "Vehicle / Details", "Date", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[#888888] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inq) => {
                  const type = getType(inq);
                  const cfg = TYPE_CONFIG[type];
                  const car = inq.cars as CarRef;
                  const { date, time } = formatDate(inq.created_at);
                  const sellFields = type === "sell" ? parseSellMessage(inq.message) : null;

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedId(selectedId === inq.id ? null : inq.id)}
                      className={`border-b border-[#EDEAE6] last:border-0 transition-colors cursor-pointer group ${
                        selectedId === inq.id
                          ? "bg-[#E8EDD8]"
                          : "hover:bg-[#EDF1E3]"
                      }`}
                    >
                      {/* Expand */}
                      <td
                        className="pl-4 pr-1 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedId(selectedId === inq.id ? null : inq.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-[#D8E4B8] border-none transition-all cursor-pointer"
                          title="Open details"
                        >
                          <PanelRightOpen size={14} strokeWidth={1.8} className="text-[#4A6020]" />
                        </button>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase ${cfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {type === "buy" ? "Buy" : type === "sell" ? "Sell" : "Contact"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {type === "sell" ? (
                          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#555555]">{inq.phone ?? "-"}</p>
                        ) : (
                          <>
                            <p className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510] leading-tight">{inq.name}</p>
                            <p className="font-[family-name:var(--font-body)] text-[11.5px] text-[#888888]">{inq.email}</p>
                          </>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-[240px]">
                        {type === "buy" && car ? (
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-10 rounded-md overflow-hidden bg-[#F6F5F1] shrink-0 border border-[#E0DDD8]">
                              {car.images?.[0]
                                ? <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><Car size={16} strokeWidth={1.5} className="text-[#CCCCCC]" /></div>
                              }
                            </div>
                            <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#2A3510] font-medium line-clamp-2 leading-snug">{car.title}</span>
                          </div>
                        ) : type === "sell" && sellFields ? (
                          <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555555]">
                            {[sellFields.Brand, sellFields.Year].filter(Boolean).join(" · ") || "-"}
                          </span>
                        ) : inq.message ? (
                          <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555555] line-clamp-2 leading-relaxed">{inq.message}</span>
                        ) : (
                          <span className="text-[#BBBBBB] text-[12px]">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">{date}</span>
                        <p className="font-[family-name:var(--font-body)] text-[11px] text-[#BBBBBB]">{time}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase ${STATUS_BADGE[inq.status]}`}>
                          {inq.status}
                        </span>
                      </td>
                      {/* Delete */}
                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleSoftDelete(inq.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-transparent hover:bg-red-50 border-none transition-all cursor-pointer"
                          title="Move to trash"
                        >
                          <Trash2 size={14} strokeWidth={1.8} className="text-red-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail drawer - only for active inquiries */}
      {selectedInquiry && (
        <DetailDrawer
          inq={selectedInquiry}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
