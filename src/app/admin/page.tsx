import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/server";
import CarsTable from "./CarsTable";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, brand, year, status, price, images, slug, created_at")
    .order("created_at", { ascending: false });

  const all = cars ?? [];
  const stats = {
    total:     all.length,
    available: all.filter((c) => c.status === "available").length,
    draft:     all.filter((c) => c.status === "draft").length,
    sold:      all.filter((c) => c.status === "sold").length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Dashboard
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mt-0.5">
            Manage your vehicle inventory
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3A4A20] text-white font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.05em] uppercase hover:bg-[#2A3510] transition-colors"
        >
          <Plus size={14} />
          Add Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",     value: stats.total,     color: "#2A3510" },
          { label: "Available", value: stats.available, color: "#166534" },
          { label: "Draft",     value: stats.draft,     color: "#888888" },
          { label: "Sold",      value: stats.sold,      color: "#DC2626" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888] mb-2">
              {label}
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none"
              style={{ color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Cars table */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDEAE6]">
          <h2 className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">
            All Vehicles
          </h2>
        </div>
        <CarsTable cars={all} />
      </div>
    </div>
  );
}
