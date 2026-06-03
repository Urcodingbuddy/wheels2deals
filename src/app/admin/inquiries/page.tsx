import { createClient } from "@/lib/server";
import { purgeExpiredInquiries } from "@/app/(admin)/actions/inquiry";
import InquiriesClient from "./InquiriesClient";
import InquiriesPageClient from "./InquiriesPageClient";
import type { DreamCarRow } from "../cars/DreamCarRequestsTable";

export default async function AdminInquiriesPage() {
  await purgeExpiredInquiries();

  const supabase = await createClient();

  const [{ data: inquiries }, { data: dreamCarRequests }] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id, name, email, phone, message, status, created_at, deleted_at, car_id, cars(title, slug, images)")
      .order("created_at", { ascending: false }),
    supabase
      .from("dream_car_requests")
      .select("id, created_at, full_name, phone, brand, model, budget, year_range, timeline, notes, status")
      .order("created_at", { ascending: false }),
  ]);

  const all = inquiries ?? [];
  const active = all.filter((i) => !i.deleted_at);
  const counts = {
    new: active.filter((i) => i.status === "new").length,
    contacted: active.filter((i) => i.status === "contacted").length,
    closed: active.filter((i) => i.status === "closed").length,
  };

  const requests = (dreamCarRequests ?? []) as DreamCarRow[];

  return (
    <InquiriesPageClient
      inquiries={all as Parameters<typeof InquiriesClient>[0]["inquiries"]}
      counts={counts}
      requests={requests}
    />
  );
}
