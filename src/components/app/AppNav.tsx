"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

const SERVICE_GROUPS = [
  {
    label: "Buy & Sell",
    items: [
      { label: "Buy a Car",       href: "/buy" },
      { label: "Sell Your Car",   href: "/sell" },
      { label: "Finance & Loans", href: "/finance" },
    ],
  },
  {
    label: "Vehicle Services",
    items: [
      { label: "Inspection",          href: "/inspect" },
      { label: "Insurance",           href: "/insurance" },
      { label: "Transfer & Renewals", href: "/transfer" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About",   href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const PREVIEW_IMAGES = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&auto=format&fit=crop",
];

function TwoLineIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.5)}
      viewBox="0 0 30 15"
      fill="none"
      aria-hidden
    >
      <line x1="0" y1="2"  x2="30" y2="2"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="0" y1="13" x2="30" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* ── Sticky navbar ── */}
      <header className="sticky top-0 z-50 h-[60px] bg-[#F6F5F1]/95 backdrop-blur-md">
        <div className="h-full max-w-[1280px] mx-auto px-6 flex items-center justify-between">

          {/* Left — Logo */}
          <Link href="/" aria-label="Wheels2Deals home">
            <img
              src="/logo.svg"
              alt="Wheels2Deals"
              className="h-[34px] w-auto brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-200"
            />
          </Link>

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

      {/* ── Mega menu ── */}
      {open && (
        <>
          <div
            className="menu-backdrop fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[150]"
            onClick={close}
          />

          <div className="menu-panel fixed top-5 right-5 bottom-5 w-[min(860px,calc(100vw-40px))] bg-white z-[200] flex flex-col rounded-[10px] overflow-hidden shadow-[0_32px_80px_rgba(13,27,62,0.5),0_0_0_1px_rgba(13,27,62,0.08)]">
            {/* Header */}
            <div className="flex items-center justify-end px-6 py-3 border-b border-[#EDEAE6]">
              <button
                onClick={close}
                className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-100 bg-transparent border-none"
              >
                <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#999]">
                  Close
                </span>
                <X size={20} color="#BAC095" strokeWidth={1.5} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left — nav links */}
              <div className="no-scrollbar flex-[0_0_42%] px-10 pt-9 pb-10 overflow-y-auto border-r border-[#EDEAE6]">
                {(() => {
                  let idx = 0;
                  return SERVICE_GROUPS.map((group) => (
                    <div key={group.label} className="mb-9">
                      <p
                        className="nav-item-anim font-[family-name:var(--font-body)] text-[11px] font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-2"
                        style={{ animationDelay: `${idx++ * 0.06 + 0.15}s` }}
                      >
                        {group.label}
                      </p>
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className="menu-rail-link nav-item-anim flex items-center justify-between py-[13px] border-b border-[#F2EFEb] no-underline"
                          style={{ animationDelay: `${idx++ * 0.06 + 0.15}s` }}
                        >
                          <span className="menu-rail-label font-[family-name:var(--font-display)] text-[22px] font-semibold text-[#2A3510] tracking-[-0.01em] leading-none transition-colors duration-200">
                            {item.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className="menu-rail-chevron"
                            color="#C8C4BE"
                            strokeWidth={1.5}
                          />
                        </Link>
                      ))}
                    </div>
                  ));
                })()}
              </div>

              {/* Right — preview images */}
              <div className="no-scrollbar flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
                {PREVIEW_IMAGES.map((src, i) => (
                  <div
                    key={src}
                    className="nav-item-anim flex-1 min-h-0 rounded-[10px] overflow-hidden"
                    style={{ animationDelay: `${0.2 + i * 0.08}s` }}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
