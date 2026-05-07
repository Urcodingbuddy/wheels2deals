"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, CheckCircle } from "lucide-react";
import { deleteCar, publishCar } from "@/app/(admin)/actions/car";
import type { Tables } from "@/types/database";

type CarRow = Pick<
  Tables<"cars">,
  "id" | "title" | "brand" | "year" | "status" | "price" | "images" | "slug" | "created_at"
>;

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  available: { bg: "bg-green-50", text: "text-green-700", label: "Available" },
  draft:     { bg: "bg-gray-100", text: "text-gray-600",  label: "Draft" },
  sold:      { bg: "bg-red-50",   text: "text-red-700",   label: "Sold" },
  reserved:  { bg: "bg-amber-50", text: "text-amber-700", label: "Reserved" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.draft;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.1em] uppercase ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export default function CarsTable({ cars }: { cars: CarRow[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

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

  if (cars.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888]">
          No vehicles yet. Add your first car.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E0DDD8] bg-[#F6F5F1]">
            {["Vehicle", "Brand / Year", "Status", "Price", "Added", ""].map((h) => (
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
          {cars.map((car) => {
            const busy = loadingId === car.id;
            return (
              <tr
                key={car.id}
                className="border-b border-[#EDEAE6] last:border-0 hover:bg-[#F6F5F1]/50 transition-colors"
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
                  <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555555]">
                    {car.brand} · {car.year}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <StatusBadge status={car.status} />
                </td>

                {/* Price */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510]">
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                      maximumFractionDigits: 0,
                    }).format(car.price)}
                  </span>
                </td>

                {/* Added */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
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
                    <a
                      href={`/admin/cars/${car.slug}`}
                      title="View inquiries"
                      className="p-1.5 rounded-md text-[#888888] hover:text-[#2A3510] hover:bg-[#F6F5F1] transition-colors"
                    >
                      <Eye size={15} strokeWidth={1.8} />
                    </a>
                    <button
                      onClick={() => handleDelete(car.id)}
                      disabled={busy}
                      title="Delete"
                      className="p-1.5 rounded-md text-[#888888] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none"
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
  );
}
