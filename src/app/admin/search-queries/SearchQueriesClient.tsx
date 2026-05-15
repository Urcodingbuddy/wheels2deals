"use client";

import { useState, useTransition } from "react";
import { SearchCheck, Trash2, Plus, TrendingUp, Eye, EyeOff } from "lucide-react";
import {
  toggleIndexed,
  deleteSearchQuery,
  addCustomQuery,
} from "@/app/(admin)/actions/search-queries";

type SearchQuery = {
  id: string;
  query: string;
  count: number;
  is_indexed: boolean;
  is_custom: boolean;
  created_at: string;
};

export default function SearchQueriesClient({ rows }: { rows: SearchQuery[] }) {
  const [items, setItems] = useState(rows);
  const [newQuery, setNewQuery] = useState("");
  const [addError, setAddError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, current: boolean) => {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_indexed: !current } : r))
    );
    startTransition(async () => {
      await toggleIndexed(id, !current);
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    startTransition(async () => {
      await deleteSearchQuery(id);
    });
  };

  const handleAdd = () => {
    const trimmed = newQuery.trim();
    if (!trimmed) { setAddError("Enter a query"); return; }
    if (items.some((r) => r.query.toLowerCase() === trimmed.toLowerCase())) {
      setAddError("Already exists"); return;
    }
    setAddError("");
    const optimistic: SearchQuery = {
      id: `tmp-${Date.now()}`,
      query: trimmed,
      count: 0,
      is_indexed: true,
      is_custom: true,
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [optimistic, ...prev]);
    setNewQuery("");
    startTransition(async () => {
      await addCustomQuery(trimmed);
    });
  };

  const indexed = items.filter((r) => r.is_indexed);
  const unindexed = items.filter((r) => !r.is_indexed);

  return (
    <div>
      {/* Add custom query */}
      <div className="mb-8 p-5 rounded-2xl border border-[#E8E4DE] bg-[#F6F5F1]">
        <p className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.12em] uppercase text-[#3A4A20] mb-3">
          Add Custom Query
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => { setNewQuery(e.target.value); setAddError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Toyota Land Cruiser 2024"
            className="flex-1 h-10 px-4 rounded-xl border border-[#D5CEBF] bg-white font-[family-name:var(--font-body)] text-[13px] focus:border-[#C9A84C] outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#2A3510] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold hover:bg-[#3A4A20] transition-colors disabled:opacity-50"
          >
            <Plus size={15} /> Add
          </button>
        </div>
        {addError && (
          <p className="mt-2 font-[family-name:var(--font-body)] text-[11px] text-red-500">{addError}</p>
        )}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-4">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888] uppercase tracking-widest mb-1">Total</p>
          <p className="font-[family-name:var(--font-display)] text-[28px] font-semibold text-[#2A3510]">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-4">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888] uppercase tracking-widest mb-1">Indexed</p>
          <p className="font-[family-name:var(--font-display)] text-[28px] font-semibold text-emerald-600">{indexed.length}</p>
        </div>
        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-4">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888] uppercase tracking-widest mb-1">Hidden</p>
          <p className="font-[family-name:var(--font-display)] text-[28px] font-semibold text-[#999]">{unindexed.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#E8E4DE] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F6F5F1] border-b border-[#E8E4DE]">
              <th className="text-left px-5 py-3 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#888]">Query</th>
              <th className="text-center px-4 py-3 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#888]">Searches</th>
              <th className="text-center px-4 py-3 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#888]">Type</th>
              <th className="text-center px-4 py-3 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#888]">Status</th>
              <th className="text-right px-5 py-3 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase text-[#888]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-16 font-[family-name:var(--font-body)] text-[13px] text-[#999]">
                  No search queries yet
                </td>
              </tr>
            )}
            {items.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-[#E8E4DE] last:border-0 transition-colors hover:bg-[#F9F8F4] ${i % 2 === 0 ? "bg-white" : "bg-[#FDFCF9]"}`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={13} className="text-[#C9A84C] shrink-0" />
                    <span className="font-[family-name:var(--font-body)] text-[13px] text-[#2A3510] font-medium">{row.query}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="font-[family-name:var(--font-body)] text-[13px] text-[#555] font-semibold">{row.count.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {row.is_custom ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C9A84C]/10 font-[family-name:var(--font-body)] text-[9px] font-bold tracking-wider uppercase text-[#C9A84C]">
                      Custom
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2A3510]/8 font-[family-name:var(--font-body)] text-[9px] font-bold tracking-wider uppercase text-[#3A4A20]">
                      Organic
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button
                    onClick={() => handleToggle(row.id, row.is_indexed)}
                    disabled={isPending}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-[family-name:var(--font-body)] text-[10px] font-bold tracking-wider uppercase transition-colors disabled:opacity-50 ${
                      row.is_indexed
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-[#F0EEE8] text-[#999] hover:bg-[#E8E4DE]"
                    }`}
                  >
                    {row.is_indexed ? <Eye size={11} /> : <EyeOff size={11} />}
                    {row.is_indexed ? "Indexed" : "Hidden"}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => handleDelete(row.id)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[#CCC] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
