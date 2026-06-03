"use client";

import { useState } from "react";
import { Inbox, Star } from "lucide-react";
import InquiriesClient from "./InquiriesClient";
import DreamCarRequestsTable, { type DreamCarRow } from "../cars/DreamCarRequestsTable";

type InquiryRow = Parameters<typeof InquiriesClient>[0]["inquiries"][number];

type Tab = "inquiries" | "dream-car";

export default function InquiriesPageClient({
  inquiries,
  counts,
  requests,
}: {
  inquiries: InquiryRow[];
  counts: { new: number; contacted: number; closed: number };
  requests: DreamCarRow[];
}) {
  const [tab, setTab] = useState<Tab>("inquiries");

  const newDreamCars = requests.filter(r => r.status === "new").length;
  const newInquiries = counts.new;

  return (
    <div>
      {/* Top-level tab bar */}
      <div className="flex items-center gap-1 px-8 pt-8 pb-0">
        <button
          onClick={() => setTab("inquiries")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.04em] transition-colors cursor-pointer border-none ${
            tab === "inquiries"
              ? "bg-[#2A3510] text-white"
              : "bg-[#EDEAE6] text-[#888] hover:text-[#2A3510] hover:bg-[#E0DDD8]"
          }`}
        >
          <Inbox size={13} strokeWidth={2} />
          Inquiries
          {newInquiries > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
              tab === "inquiries" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
            }`}>
              {newInquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setTab("dream-car")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-[family-name:var(--font-body)] text-[12px] font-semibold tracking-[0.04em] transition-colors cursor-pointer border-none ${
            tab === "dream-car"
              ? "bg-[#2A3510] text-white"
              : "bg-[#EDEAE6] text-[#888] hover:text-[#2A3510] hover:bg-[#E0DDD8]"
          }`}
        >
          <Star size={13} strokeWidth={2} />
          Dream Car
          {newDreamCars > 0 && (
            <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
              tab === "dream-car" ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
            }`}>
              {newDreamCars}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {tab === "inquiries" && (
        <InquiriesClient inquiries={inquiries} counts={counts} />
      )}
      {tab === "dream-car" && (
        <div className="px-8 py-8">
          <DreamCarRequestsTable requests={requests} />
        </div>
      )}
    </div>
  );
}
