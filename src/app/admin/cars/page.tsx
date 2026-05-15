import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/server";
import CarsPageClient from "./CarsPageClient";

export default async function VehiclesPage() {
  const supabase = await createClient();

  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, brand, year, status, price, images, slug, created_at, views_count, category")
    .order("created_at", { ascending: false });

  const all = cars ?? [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888] mb-1">
            Admin
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Vehicles
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888] mt-0.5">
            {all.length} vehicle{all.length !== 1 ? "s" : ""} in inventory
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

      <CarsPageClient cars={all} />
    </div>
  );
}
