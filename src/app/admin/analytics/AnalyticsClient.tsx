"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip
);

type TopCar = { title: string; views: number };
type TopSearch = { query: string; count: number };
type DailyView = { date: string; views: number };

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6">
      <p className="font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.12em] uppercase text-[#3A4A20] mb-6">
        {title}
      </p>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <p className="text-center py-10 font-[family-name:var(--font-body)] text-[13px] text-[#ccc]">
      No data yet
    </p>
  );
}

const BASE_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: "#555" } },
    y: {
      grid: { color: "#EDEDEC" },
      ticks: { font: { size: 11 }, color: "#555" },
      beginAtZero: true,
    },
  },
} as const;

export default function AnalyticsClient({
  topCars,
  topSearches,
  dailyViews,
}: {
  topCars: TopCar[];
  topSearches: TopSearch[];
  dailyViews: DailyView[];
}) {
  return (
    <div className="space-y-6">
      {/* Daily views line chart */}
      <ChartCard title="Daily Views (Last 30 Days)">
        {dailyViews.every((d) => d.views === 0) ? (
          <Empty />
        ) : (
          <div style={{ height: 220 }}>
            <Line
              data={{
                labels: dailyViews.map((d) => d.date),
                datasets: [
                  {
                    data: dailyViews.map((d) => d.views),
                    borderColor: "#C9A84C",
                    backgroundColor: "rgba(201,168,76,0.08)",
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointBackgroundColor: "#C9A84C",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{
                ...BASE_OPTS,
                plugins: {
                  ...BASE_OPTS.plugins,
                  tooltip: {
                    callbacks: {
                      label: (item: TooltipItem<"line">) => ` ${item.raw} views`,
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </ChartCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top viewed cars */}
        <ChartCard title="Top 10 Most Viewed Cars">
          {topCars.length === 0 ? (
            <Empty />
          ) : (
            <div style={{ height: 280 }}>
              <Bar
                data={{
                  labels: topCars.map((c) =>
                    c.title.length > 16 ? `${c.title.slice(0, 16)}…` : c.title
                  ),
                  datasets: [
                    {
                      data: topCars.map((c) => c.views),
                      backgroundColor: "#2A3510",
                      borderRadius: 6,
                      barThickness: 18,
                    },
                  ],
                }}
                options={{
                  ...BASE_OPTS,
                  plugins: {
                    ...BASE_OPTS.plugins,
                    tooltip: {
                      callbacks: {
                        title: (items: TooltipItem<"bar">[]) =>
                          topCars[items[0].dataIndex]?.title ?? "",
                        label: (item: TooltipItem<"bar">) => ` ${item.raw} views`,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </ChartCard>

        {/* Top search queries */}
        <ChartCard title="Top 10 Search Queries">
          {topSearches.length === 0 ? (
            <Empty />
          ) : (
            <div style={{ height: 280 }}>
              <Bar
                data={{
                  labels: topSearches.map((s) =>
                    s.query.length > 16 ? `${s.query.slice(0, 16)}…` : s.query
                  ),
                  datasets: [
                    {
                      data: topSearches.map((s) => s.count),
                      backgroundColor: "#C9A84C",
                      borderRadius: 6,
                      barThickness: 18,
                    },
                  ],
                }}
                options={{
                  ...BASE_OPTS,
                  plugins: {
                    ...BASE_OPTS.plugins,
                    tooltip: {
                      callbacks: {
                        title: (items: TooltipItem<"bar">[]) =>
                          topSearches[items[0].dataIndex]?.query ?? "",
                        label: (item: TooltipItem<"bar">) => ` ${item.raw} searches`,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
