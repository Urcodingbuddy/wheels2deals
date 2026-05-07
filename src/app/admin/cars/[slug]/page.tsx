import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { createClient } from "@/lib/server";
import InquiryStatusButton from "./InquiryStatusButton";

const STATUS_COUNT_STYLE: Record<string, string> = {
  new:       "bg-sky-50 text-sky-700",
  contacted: "bg-amber-50 text-amber-700",
  closed:    "bg-[#F0F3E8] text-[#3A4A20]",
};

export default async function AdminCarInquiriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("id, title, brand, year, status, slug")
    .eq("slug", slug)
    .single();

  if (!car) notFound();

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, name, email, phone, message, status, created_at")
    .eq("car_id", car.id)
    .order("created_at", { ascending: false });

  const all = inquiries ?? [];
  const counts = {
    new:       all.filter((i) => i.status === "new").length,
    contacted: all.filter((i) => i.status === "contacted").length,
    closed:    all.filter((i) => i.status === "closed").length,
  };

  return (
    <div className="p-8">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[12px] text-[#888888] hover:text-[#2A3510] transition-colors mb-4"
        >
          <ArrowLeft size={13} strokeWidth={2} />
          Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-[24px] font-semibold uppercase tracking-[-0.02em] text-[#2A3510] leading-tight">
              {car.title}
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888] mt-0.5">
              {car.brand} &middot; {car.year} &middot; Inquiries
            </p>
          </div>
          {car.status === "available" && (
            <Link
              href={`/buy/${car.slug}`}
              target="_blank"
              className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.08em] uppercase text-[#3A4A20] border border-[#C8D0B0] px-3 py-1.5 rounded-lg hover:bg-[#F0F3E8] transition-colors"
            >
              View Listing ↗
            </Link>
          )}
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(["new", "contacted", "closed"] as const).map((s) => (
          <div key={s} className="bg-white rounded-xl border border-[#E0DDD8] px-5 py-4">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#888888] mb-2">
              {s}
            </p>
            <p className={`font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none ${STATUS_COUNT_STYLE[s].split(" ")[1]}`}>
              {counts[s]}
            </p>
          </div>
        ))}
      </div>

      {/* Inquiries */}
      <div className="bg-white rounded-xl border border-[#E0DDD8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDEAE6] flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-body)] text-[13px] font-semibold text-[#2A3510]">
            All Inquiries
          </h2>
          <span className="font-[family-name:var(--font-body)] text-[11px] text-[#888888]">
            {all.length} total
          </span>
        </div>

        {all.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <Inbox size={32} strokeWidth={1.2} className="text-[#CCCCCC]" />
            <p className="font-[family-name:var(--font-body)] text-[13px] text-[#888888]">
              No inquiries yet for this vehicle.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0DDD8] bg-[#F6F5F1]">
                  {["Contact", "Phone", "Message", "Date", "Status"].map((h) => (
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
                {all.map((inq) => (
                  <tr
                    key={inq.id}
                    className="border-b border-[#EDEAE6] last:border-0 hover:bg-[#F6F5F1]/50 transition-colors"
                  >
                    {/* Contact */}
                    <td className="px-5 py-4">
                      <p className="font-[family-name:var(--font-body)] text-[13px] font-medium text-[#2A3510] leading-tight">
                        {inq.name}
                      </p>
                      <a
                        href={`mailto:${inq.email}`}
                        className="font-[family-name:var(--font-body)] text-[11.5px] text-[#3A4A20] hover:underline"
                      >
                        {inq.email}
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {inq.phone ? (
                        <a
                          href={`tel:${inq.phone}`}
                          className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555555] hover:text-[#2A3510]"
                        >
                          {inq.phone}
                        </a>
                      ) : (
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#BBBBBB]">—</span>
                      )}
                    </td>

                    {/* Message */}
                    <td className="px-5 py-4 max-w-[280px]">
                      {inq.message ? (
                        <p className="font-[family-name:var(--font-body)] text-[12.5px] text-[#555555] line-clamp-2 leading-relaxed">
                          {inq.message}
                        </p>
                      ) : (
                        <span className="font-[family-name:var(--font-body)] text-[12px] text-[#BBBBBB]">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-[family-name:var(--font-body)] text-[12px] text-[#888888]">
                        {new Date(inq.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                      <p className="font-[family-name:var(--font-body)] text-[11px] text-[#BBBBBB]">
                        {new Date(inq.created_at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <InquiryStatusButton inquiryId={inq.id} current={inq.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
