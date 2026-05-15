"use client";

import { useState, useRef, useTransition } from "react";
import { GripVertical, Pin, PinOff, Save, AlertCircle, Check, X, Hash, Search } from "lucide-react";
import { saveCarOrder } from "@/app/(admin)/actions/ordering";

type CarSlim = {
  id: string;
  title: string;
  brand: string;
  year: number;
  images: string[];
  sort_order: number | null;
  status: string;
};

export default function OrderingClient({
  indexed: initialIndexed,
  unindexed: initialUnindexed,
}: {
  indexed: CarSlim[];
  unindexed: CarSlim[];
}) {
  const [indexed, setIndexed] = useState<CarSlim[]>(initialIndexed);
  const [unindexed, setUnindexed] = useState<CarSlim[]>(initialUnindexed);
  // Track IDs that were indexed at last save/load so we can null them out if unpinned
  const initialIndexedIds = useRef(new Set(initialIndexed.map((c) => c.id)));
  const [unindexedSearch, setUnindexedSearch] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Drag state
  const dragIndexRef = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  // Inline position edit state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // ── Drag handlers ────────────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, i: number) => {
    dragIndexRef.current = i;
    setDragIndex(i);
    e.dataTransfer.effectAllowed = "move";
    // Needed for Firefox
    e.dataTransfer.setData("text/plain", String(i));
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndexRef.current === null || dragIndexRef.current === i) return;
    setDropTarget(i);
  };

  const handleDrop = (e: React.DragEvent, targetI: number) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === targetI) {
      setDropTarget(null);
      return;
    }
    const next = [...indexed];
    const [item] = next.splice(from, 1);
    next.splice(targetI, 0, item);
    setIndexed(next);
    setIsDirty(true);
    setSaved(false);
    setDragIndex(null);
    setDropTarget(null);
    dragIndexRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropTarget(null);
    dragIndexRef.current = null;
  };

  // ── Inline position edit ─────────────────────────────────────────────────────

  const commitPositionEdit = (fromIndex: number) => {
    const target = parseInt(editingValue, 10);
    setEditingIndex(null);
    setEditingValue("");
    if (isNaN(target) || target < 1 || target > indexed.length || target === fromIndex + 1) return;
    const toIndex = target - 1;
    const next = [...indexed];
    // Swap the two items
    [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
    setIndexed(next);
    setIsDirty(true);
    setSaved(false);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    startTransition(async () => {
      const indexedIds = indexed.map((c) => c.id);
      // Only send unindexed IDs that were previously indexed (need their sort_order nulled)
      const unindexedIds = unindexed
        .filter((c) => initialIndexedIds.current.has(c.id))
        .map((c) => c.id);
      await saveCarOrder(indexedIds, unindexedIds);
      // Update our reference to reflect the new saved state
      initialIndexedIds.current = new Set(indexedIds);
      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  // ── Unpin (indexed → unindexed) ──────────────────────────────────────────────

  const handleUnpin = (car: CarSlim) => {
    setIndexed((prev) => prev.filter((c) => c.id !== car.id));
    setUnindexed((prev) => [car, ...prev]);
    setIsDirty(true);
    setSaved(false);
  };

  // ── Pin (unindexed → end of indexed list) ────────────────────────────────────

  const handlePin = (car: CarSlim) => {
    const position = indexed.length + 1;
    setUnindexed((prev) => prev.filter((c) => c.id !== car.id));
    setIndexed((prev) => [...prev, { ...car, sort_order: position }]);
    setIsDirty(true);
    setSaved(false);
  };

  return (
    <div className="min-w-0 overflow-x-hidden">
      {/* Save bar */}
      <div className={`sticky top-0 z-20 mb-6 flex items-center justify-between rounded-2xl border px-5 py-3.5 transition-all ${
        isDirty
          ? "border-[#C9A84C]/40 bg-[#FFFDF5] shadow-sm"
          : saved
          ? "border-emerald-200 bg-emerald-50"
          : "border-[#E8E4DE] bg-[#F6F5F1]"
      }`}>
        <div className="flex items-center gap-2">
          {isDirty && <AlertCircle size={14} className="text-[#C9A84C]" />}
          {saved && <Check size={14} className="text-emerald-600" />}
          <span className="font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510]">
            {isDirty
              ? "You have unsaved changes — drag to reorder, then save"
              : saved
              ? "Order saved successfully"
              : `${indexed.length} cars indexed · ${unindexed.length} unindexed`}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A3510] text-white font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider hover:bg-[#3A4A20] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save size={13} />
          {isPending ? "Saving…" : "Save Order"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start min-w-0">

        {/* ── Left: indexed drag list ── */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={14} className="text-[#3A4A20]" />
            <h2 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.15em] uppercase text-[#3A4A20]">
              Featured Order
            </h2>
            <span className="text-[10px] font-semibold text-[#AAA] bg-[#F0EEE8] px-2 py-0.5 rounded-full">
              {indexed.length} cars
            </span>
          </div>

          {indexed.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-[#E0DDD8] py-16 text-center">
              <Pin size={24} className="mx-auto mb-3 text-[#CCC]" />
              <p className="font-[family-name:var(--font-body)] text-[13px] text-[#AAA]">
                No cars indexed yet. Pin cars from the right panel.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {indexed.map((car, i) => {
                const isDragging = dragIndex === i;
                const isTarget = dropTarget === i;
                return (
                  <div
                    key={car.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`relative flex items-center gap-3 rounded-2xl border bg-white p-3 transition-all select-none ${
                      isDragging
                        ? "opacity-40 scale-[0.98] border-[#C9A84C]/40 shadow-lg"
                        : isTarget
                        ? "border-[#C9A84C] shadow-[0_0_0_2px_rgba(201,168,76,0.2)]"
                        : "border-[#E8E4DE] hover:border-[#D5CEBF] hover:shadow-sm"
                    }`}
                  >
                    {/* Drop line indicator */}
                    {isTarget && !isDragging && (
                      <div className="absolute -top-[2px] left-4 right-4 h-[2px] rounded-full bg-[#C9A84C]" />
                    )}

                    {/* Position badge — click to edit */}
                    {editingIndex === i ? (
                      <input
                        autoFocus
                        type="number"
                        min={1}
                        max={indexed.length}
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => commitPositionEdit(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitPositionEdit(i);
                          if (e.key === "Escape") { setEditingIndex(null); setEditingValue(""); }
                        }}
                        className="w-8 h-8 rounded-xl border-2 border-[#C9A84C] bg-white text-[#2A3510] text-center font-[family-name:var(--font-body)] text-[12px] font-bold shrink-0 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    ) : (
                      <div
                        onClick={() => { setEditingIndex(i); setEditingValue(String(i + 1)); }}
                        title="Click to change position"
                        className="w-8 h-8 rounded-xl bg-[#2A3510] text-white flex items-center justify-center font-[family-name:var(--font-body)] text-[12px] font-bold shrink-0 cursor-pointer hover:bg-[#C9A84C] hover:text-[#2A3510] transition-colors"
                      >
                        {i + 1}
                      </div>
                    )}

                    {/* Grip */}
                    <div className="cursor-grab active:cursor-grabbing text-[#CCC] hover:text-[#888] transition-colors shrink-0 touch-none">
                      <GripVertical size={18} />
                    </div>

                    {/* Thumbnail */}
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#F6F5F1] shrink-0">
                      {car.images[0] ? (
                        <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-[#CCC]">No img</div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510] truncate">
                        {car.title}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-[11px] text-[#AAA]">
                        {car.brand} · {car.year}
                      </p>
                    </div>

                    {/* Unpin */}
                    <button
                      onClick={() => handleUnpin(car)}
                      title="Remove from index"
                      className="p-1.5 rounded-lg text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right: unindexed pool ── */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <PinOff size={14} className="text-[#888]" />
            <h2 className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.15em] uppercase text-[#888]">
              Unindexed Cars
            </h2>
            <span className="text-[10px] font-semibold text-[#AAA] bg-[#F0EEE8] px-2 py-0.5 rounded-full">
              {unindexed.length}
            </span>
          </div>

          {unindexed.length > 0 && (
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA] pointer-events-none" />
              <input
                type="text"
                value={unindexedSearch}
                onChange={(e) => setUnindexedSearch(e.target.value)}
                placeholder="Search by title or brand…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E4DE] bg-white font-[family-name:var(--font-body)] text-[12px] text-[#2A3510] placeholder:text-[#CCC] focus:outline-none focus:border-[#2A3510]/30"
              />
              {unindexedSearch && (
                <button
                  onClick={() => setUnindexedSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#CCC] hover:text-[#888]"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {unindexed.length === 0 ? (
            <div className="rounded-2xl border border-[#E8E4DE] py-10 text-center">
              <p className="font-[family-name:var(--font-body)] text-[12px] text-[#AAA]">All cars are indexed.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1" onWheel={(e) => e.stopPropagation()}>
              {unindexed.filter((car) => {
                if (!unindexedSearch.trim()) return true;
                const q = unindexedSearch.toLowerCase();
                return car.title.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q);
              }).map((car) => (
                <div
                  key={car.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E8E4DE] bg-white p-2.5 hover:border-[#D5CEBF] transition-colors"
                >
                  <div className="w-12 h-8 rounded-lg overflow-hidden bg-[#F6F5F1] shrink-0">
                    {car.images[0] ? (
                      <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-[#CCC]">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#2A3510] truncate">
                      {car.title}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-[10px] text-[#AAA]">
                      {car.brand} · {car.year}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePin(car)}
                    title="Add to index"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A3510]/5 text-[#2A3510] hover:bg-[#2A3510] hover:text-white font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    <Pin size={11} />
                    Pin
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
