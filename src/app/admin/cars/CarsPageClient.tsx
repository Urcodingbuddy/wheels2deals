"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, CheckCircle, Pencil, Inbox, Search, X } from "lucide-react";
import Link from "next/link";
import { deleteCar, publishCar } from "@/app/(admin)/actions/car";
import type { Tables } from "@/types/database";

type CarRow = Pick<
  Tables<"cars">,
  "id" | "title" | "brand" | "year" | "status" | "price" | "images" | "slug" | "created_at" | "views_count"
> & { category?: string | null };

type StatusFilter = "all" | "available" | "draft" | "sold" | "reserved";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "available", label: "Available" },
  { key: "draft",     label: "Draft"     },
  { key: "sold",      label: "Sold"      },
  { key: "reserved",  label: "Reserved"  },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-green-50",  text: "text-green-700",  label: "Available" },
  draft:     { bg: "bg-gray-100",  text: "text-gray-600",   label: "Draft"     },
  sold:      { bg: "bg-red-50",    text: "text-red-700",    label: "Sold"      },
  reserved:  { bg: "bg-amber-50",  text: "text-amber-700",  label: "Reserved"  },
};

const CATEGORY_LABELS: Record<string, string> = {
  economy: "Economy", sports: "Sports", suv: "SUV", luxury: "Luxury", exotic: "Exotic",
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.draft;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.1em] uppercase ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function CarsPageClient({ cars }: { cars: CarRow[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const tabCounts = {
    all:       cars.length,
    available: cars.filter((c) => c.status === "available").length,
    draft:     cars.filter((c) => c.status === "draft").length,
    sold:      cars.filter((c) => c.status === "sold").length,
    reserved:  cars.filter((c) => c.status === "reserved").length,
  };

  const filtered = cars.filter((c) => {
    const matchTab = activeTab === "all" || c.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this car? This cannot be undone.")) return;
    setLoadingId(id);
    await deleteCar(id);
    setLoadingId(null);
    router.refresh();
  }

  async function handlePublish(id: string) {
    setLoadingId(id);
    await publishCar(id);
    setLoadingId(null);
    router.refresh();
  }

  return (
    <div>
      {/* Tabs + Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 bg-[#F6F5F1] rounded-xl p-1">
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-[family-name:var(--font-body)] text-[11px] font-semibold transition-all ${
                activeTab === key
                  ? "bg-white text-[#2A3510] shadow-sm"
                  : "text-[#888] hover:text-[#2A3510]"
              }`}
            >
              {label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === key ? "bg-[#2A3510]/10 text-[#2A3510]" : "bg-[#E0DDD8] text-[#888]"
              }`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[220px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAA]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or brand…"
            className="w-full h-9 pl-8 pr-8 rounded-xl border border-[#E0DDD8] bg-white font-[family-name:var(--font-body)] text-[12px] focus:border-[#C9A84C] outline-none transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555]">
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888]">
              {search ? "No vehicles match your search." : "No vehicles in this category."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DDD8] bg-[#F6F5F1]">
                  {["Vehicle", "Brand / Year", "Category", "Views", "Status", "Price", "Added", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.15em] uppercase text-[#888] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((car) => {
                  const busy = loadingId === car.id;
                  return (
                    <tr
                      key={car.id}
                      className="border-b border-[#EDEAE6] last:border-0 hover:bg-[#F6F5F1]/60 transition-colors"
                    >
                      {/* Vehicle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-9 rounded-md bg-[#F6F5F1] border border-[#E0DDD8] overflow-hidden shrink-0">
                            {car.images[0] ? (
                              <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[8px] text-[#BBBBBB]">No img</span>
                              </div>
                            )}
                          </div>
                          <span className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510] leading-tight max-w-[200px] truncate">
                            {car.title}
                          </span>
                        </div>
                      </td>

                      {/* Brand / Year */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555]">
                          {car.brand} · {car.year}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.1em] uppercase text-[#888]">
                          {car.category ? CATEGORY_LABELS[car.category] : "-"}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#555] font-medium">
                          {(car.views_count ?? 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={car.status} />
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510]">
                          {car.price
                            ? new Intl.NumberFormat("en-AE", {
                                style: "currency",
                                currency: "AED",
                                maximumFractionDigits: 0,
                              }).format(car.price)
                            : "On Request"}
                        </span>
                      </td>

                      {/* Added */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888]">
                          {new Date(car.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          {car.status === "draft" && (
                            <button
                              onClick={() => handlePublish(car.id)}
                              disabled={busy}
                              title="Publish"
                              className="p-1.5 rounded-md text-[#3A4A20] hover:bg-green-50 transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none"
                            >
                              <CheckCircle size={15} strokeWidth={1.8} />
                            </button>
                          )}
                          <Link
                            href={`/buy/${car.slug}`}
                            target="_blank"
                            title="View live"
                            className="p-1.5 rounded-md text-[#888] hover:text-[#2A3510] hover:bg-[#F6F5F1] transition-colors"
                          >
                            <Eye size={15} strokeWidth={1.8} />
                          </Link>
                          <Link
                            href={`/admin/cars/${car.slug}/edit`}
                            title="Edit"
                            className="p-1.5 rounded-md text-[#888] hover:text-[#2A3510] hover:bg-[#F6F5F1] transition-colors"
                          >
                            <Pencil size={15} strokeWidth={1.8} />
                          </Link>
                          <Link
                            href={`/admin/cars/${car.slug}`}
                            title="View inquiries"
                            className="p-1.5 rounded-md text-[#888] hover:text-[#2A3510] hover:bg-[#F6F5F1] transition-colors"
                          >
                            <Inbox size={15} strokeWidth={1.8} />
                          </Link>
                          <button
                            onClick={() => handleDelete(car.id)}
                            disabled={busy}
                            title="Delete"
                            className="p-1.5 rounded-md text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none"
                          >
                            <Trash2 size={15} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
