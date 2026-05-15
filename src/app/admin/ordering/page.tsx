import { createClient } from "@/lib/server";
import OrderingClient from "./OrderingClient";

export default async function OrderingPage() {
  const supabase = await createClient();

  const { data: cars } = await supabase
    .from("cars")
    .select("id, title, brand, year, images, sort_order, status")
    .eq("status", "available")
    .order("sort_order", { ascending: true, nullsFirst: false });

  const all = cars ?? [];
  const indexed = all.filter((c) => c.sort_order !== null).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const unindexed = all.filter((c) => c.sort_order === null);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888] mb-1">
          Admin
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
          Car Ordering
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888] mt-1">
          Drag to reorder indexed cars. They appear first on the /buy page. Unindexed cars fall below, sorted by date.
        </p>
      </div>

      <OrderingClient indexed={indexed} unindexed={unindexed} />
    </div>
  );
}
