import { createClient } from "@/lib/server";
import { purgeExpiredInquiries } from "@/app/(admin)/actions/inquiry";
import InquiriesClient from "./InquiriesClient";

export default async function AdminInquiriesPage() {
  // Purge anything older than 15 days on every page load
  await purgeExpiredInquiries();

  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select(
      "id, name, email, phone, message, status, created_at, deleted_at, car_id, cars(title, slug, images)",
    )
    .order("created_at", { ascending: false });

  const all = inquiries ?? [];
  const active = all.filter((i) => !i.deleted_at);
  const counts = {
    new: active.filter((i) => i.status === "new").length,
    contacted: active.filter((i) => i.status === "contacted").length,
    closed: active.filter((i) => i.status === "closed").length,
  };

  return (
    <InquiriesClient
      inquiries={all as Parameters<typeof InquiriesClient>[0]["inquiries"]}
      counts={counts}
    />
  );
}
