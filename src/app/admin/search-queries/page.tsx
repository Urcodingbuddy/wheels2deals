import { createClient } from "@/lib/server";
import SearchQueriesClient from "./SearchQueriesClient";

export default async function SearchQueriesPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("search_queries")
    .select("id, query, count, is_indexed, is_custom, created_at")
    .order("count", { ascending: false });

  return (
    <div className="px-8 py-8">
      <div className="mb-8">
        <p className="font-[family-name:var(--font-body)] text-[10px] tracking-[0.25em] uppercase text-[#888] mb-1">
          Admin
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510]">
          Search Queries
        </h1>
        <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888] mt-1">
          Manage which searches appear as trending suggestions on the /buy page.
        </p>
      </div>

      <SearchQueriesClient rows={rows ?? []} />
    </div>
  );
}
