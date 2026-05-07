"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/app/(admin)/actions/inquiry";
import type { Enums } from "@/types/database";

const STATUSES: { value: Enums<"inquiry_status">; label: string; active: string; inactive: string }[] = [
  { value: "new",       label: "New",       active: "bg-sky-600 text-white",     inactive: "text-sky-600 border-sky-200 hover:bg-sky-50" },
  { value: "contacted", label: "Contacted", active: "bg-amber-500 text-white",   inactive: "text-amber-600 border-amber-200 hover:bg-amber-50" },
  { value: "closed",    label: "Closed",    active: "bg-[#3A4A20] text-white",   inactive: "text-[#3A4A20] border-[#C8D0B0] hover:bg-[#F0F3E8]" },
];

export default function InquiryStatusButton({
  inquiryId,
  current,
}: {
  inquiryId: string;
  current: Enums<"inquiry_status">;
}) {
  const [status, setStatus] = useState(current);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function change(next: Enums<"inquiry_status">) {
    if (next === status || pending) return;
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const res = await updateInquiryStatus(inquiryId, next);
      if (!res.success) {
        setStatus(prev);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      {STATUSES.map((s) => (
        <button
          key={s.value}
          onClick={() => change(s.value)}
          disabled={pending}
          className={`px-2.5 py-1 rounded-md font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.08em] uppercase border transition-colors disabled:opacity-60 cursor-pointer ${
            status === s.value ? s.active + " border-transparent" : s.inactive + " bg-transparent"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
