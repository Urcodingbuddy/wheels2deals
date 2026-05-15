import { createClient } from "@/lib/server";
import AnalyticsClient from "./AnalyticsClient";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AE", { month: "short", day: "numeric" });
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: topCarsRaw }, { data: topSearchesRaw }, { data: viewLogsRaw }] =
    await Promise.all([
      supabase
        .from("cars")
        .select("title, views_count")
        .order("views_count", { ascending: false })
        .limit(10),
      supabase
        .from("search_queries")
        .select("query, count")
        .order("count", { ascending: false })
        .limit(10),
      supabase
        .from("car_view_logs")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

  const topCars = (topCarsRaw ?? []).map((r) => ({
    title: r.title,
    views: r.views_count ?? 0,
  }));

  const topSearches = (topSearchesRaw ?? []).map((r) => ({
    query: r.query,
    count: r.count,
  }));

  // Aggregate view logs by date
  const countsByDate = new Map<string, number>();
  for (const log of viewLogsRaw ?? []) {
    const d = formatDate(log.created_at);
    countsByDate.set(d, (countsByDate.get(d) ?? 0) + 1);
  }

  // Build last-30-day series (fill gaps with 0)
  const dailyViews: { date: string; views: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = formatDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString());
    dailyViews.push({ date: d, views: countsByDate.get(d) ?? 0 });
  }

  const totalViews = dailyViews.reduce((s, r) => s + r.views, 0);
  const totalSearches = topSearches.reduce((s, r) => s + r.count, 0);

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888] mb-1">
          Admin
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
          Analytics
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888] mt-1">
          Views and search trends for the last 30 days.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888] uppercase tracking-widest mb-1">Views (30d)</p>
          <p className="font-[family-name:var(--font-display)] text-[36px] font-semibold text-[#2A3510]">
            {totalViews.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5">
          <p className="font-[family-name:var(--font-body)] text-[11px] text-[#888] uppercase tracking-widest mb-1">Legit Searches</p>
          <p className="font-[family-name:var(--font-display)] text-[36px] font-semibold text-[#C9A84C]">
            {totalSearches.toLocaleString()}
          </p>
        </div>
      </div>

      <AnalyticsClient
        topCars={topCars}
        topSearches={topSearches}
        dailyViews={dailyViews}
      />
    </div>
  );
}
