"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";
import { MegaMenu, TwoLineIcon } from "@/components/shared/MegaMenu";

export function AppNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const pathname = usePathname();
  const isDetailPage = /^\/buy\/.+/.test(pathname);
  const isBuyPage = pathname === "/buy";

  return (
    <>
      {/* ── Sticky navbar ── */}
      <header className={`sticky top-0 z-50 h-[60px] ${isDetailPage ? "bg-white" : "bg-[#F6F5F1]/95"} backdrop-blur-md`}>
        <div className="h-full w-[90vw] mx-auto flex items-center justify-between">

          {/* Left — Back button (detail pages) or Logo */}
          <div className="flex items-center gap-4">
            {isDetailPage && (
              <Link
                href="/buy"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#3A4A20] hover:bg-[#2A3510] transition-colors duration-200"
                aria-label="Back to listings"
              >
                <ArrowLeft size={15} strokeWidth={2} className="text-white" />
              </Link>
            )}
            {isBuyPage && (
              <Link
                href="/"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#3A4A20] hover:bg-[#2A3510] transition-colors duration-200"
                aria-label="Go to home"
              >
                <House size={15} strokeWidth={2} className="text-white" />
              </Link>
            )}
            <Link href="/" aria-label="Wheels2Deals home">
              <img
                src="/logo.svg"
                alt="Wheels2Deals"
                className="h-[34px] w-auto brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* Right — Menu pill */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="inline-flex items-center gap-3 rounded-full bg-[#2A3510] px-5 py-2.5 font-[family-name:var(--font-display)] text-[12px] font-bold tracking-[0.12em] text-white transition-all duration-200 hover:bg-[#3A4A20] hover:scale-[1.03] cursor-pointer border-none"
          >
            <span>Menu</span>
            <TwoLineIcon size={16} />
          </button>
        </div>
      </header>

      {/* ── Mega menu (same design as landing page) ── */}
      {open && <MegaMenu onClose={close} />}
    </>
  );
}
