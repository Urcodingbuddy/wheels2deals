import Link from "next/link";
import { Plus, TrendingUp, Eye, Search, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/server";
import CarsTable from "./CarsTable";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { data: cars },
    { data: allViewsCars },
    { data: topSearches },
    { data: topCar },
  ] = await Promise.all([
    supabase
      .from("cars")
      .select("id, title, brand, year, status, price, images, slug, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("cars")
      .select("views_count"),
    supabase
      .from("search_queries")
      .select("query, count")
      .order("count", { ascending: false })
      .limit(1),
    supabase
      .from("cars")
      .select("title, views_count")
      .order("views_count", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const totalViews = (allViewsCars ?? []).reduce((sum, c) => sum + (c.views_count ?? 0), 0);

  const all = cars ?? [];
  const recentCars = all.slice(0, 5);
  const stats = {
    total:     all.length,
    available: all.filter((c) => c.status === "available").length,
    draft:     all.filter((c) => c.status === "draft").length,
    sold:      all.filter((c) => c.status === "sold").length,
  };

  const topSearch = topSearches?.[0] ?? null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
            Dashboard
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mt-0.5">
            Overview of your inventory and activity
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

      {/* Inventory stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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

      {/* Analytics mini-stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#2A3510]/8 flex items-center justify-center shrink-0">
            <Eye size={18} className="text-[#2A3510]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888] mb-0.5">
              Total Views
            </p>
            <p className="font-[family-name:var(--font-display)] text-[24px] font-semibold text-[#2A3510] leading-none">
              {totalViews.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
            <Search size={18} className="text-[#C9A84C]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888] mb-0.5">
              Top Search
            </p>
            <p className="font-[family-name:var(--font-body)] text-[15px] font-semibold text-[#2A3510] leading-none truncate max-w-[140px]">
              {topSearch ? topSearch.query : "—"}
            </p>
            {topSearch && (
              <p className="font-[family-name:var(--font-body)] text-[10px] text-[#AAA] mt-0.5">
                {topSearch.count.toLocaleString()} searches
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888] mb-0.5">
              Most Viewed
            </p>
            <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510] leading-tight truncate max-w-[140px]">
              {topCar?.title ?? "—"}
            </p>
            {topCar && (
              <p className="font-[family-name:var(--font-body)] text-[10px] text-[#AAA] mt-0.5">
                {(topCar.views_count ?? 0).toLocaleString()} views total
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { href: "/admin/analytics",      label: "View Analytics",  sub: "Charts & trends"          },
          { href: "/admin/inquiries",       label: "Inquiries",       sub: "Manage buyer messages"    },
          { href: "/admin/search-queries",  label: "Search Queries",  sub: "Control trending searches" },
        ].map(({ href, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between px-5 py-4 bg-white rounded-xl border border-[#E0DDD8] hover:border-[#C9A84C]/50 hover:shadow-sm transition-all"
          >
            <div>
              <p className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">{label}</p>
              <p className="font-[family-name:var(--font-body)] text-[11px] text-[#AAA] mt-0.5">{sub}</p>
            </div>
            <ArrowRight size={15} className="text-[#CCC] group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent vehicles */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDEAE6] flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">
            Recent Vehicles
          </h2>
          <Link
            href="/admin/cars"
            className="font-[family-name:var(--font-body)] text-[11px] font-semibold text-[#C9A84C] hover:text-[#A07E2E] transition-colors flex items-center gap-1"
          >
            Manage All <ArrowRight size={12} />
          </Link>
        </div>
        <CarsTable cars={recentCars} />
      </div>
    </div>
  );
}
