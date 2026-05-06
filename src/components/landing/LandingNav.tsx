"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

const SERVICE_GROUPS = [
  {
    label: "Buy & Sell",
    items: [
      { label: "Buy a Car", href: "/buy" },
      { label: "Sell Your Car", href: "/sell" },
      { label: "Finance & Loans", href: "/finance" },
    ],
  },
  {
    label: "Vehicle Services",
    items: [
      { label: "Inspection", href: "/inspect" },
      { label: "Insurance", href: "/insurance" },
      { label: "Transfer & Renewals", href: "/transfer" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const PREVIEW_IMAGES = [
  "/menu_exotic.png",
  "/menu_suv.png",
  "/menu_sedan.png",
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
      <line
        x1="0"
        y1="2"
        x2="30"
        y2="2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="13"
        x2="30"
        y2="13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      {/* Navbar */}
      <header className="absolute top-10 left-0 right-0 z-[100] flex items-center justify-between px-10">
        {/* Left — logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center no-underline">
            <img
              src="/logo.svg"
              alt="wheels2deals"
              className="h-[38px] w-auto brightness-0 invert block"
            />
          </Link>
        </div>

        {/* Center — scroll anchors */}
        <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "How it Works", href: "#how-it-works" },
            { label: "Services", href: "#services" },
            { label: "Reviews", href: "#reviews" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative font-[family-name:var(--font-body)] text-[15px] font-normal tracking-[0.02em] text-white no-underline py-1"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
            </a>
          ))}
        </nav>

        {/* Right — Menu */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2.5 font-[family-name:var(--font-display)] text-[12px] font-bold tracking-[0.12em] text-[#2A3510] transition-all duration-200 hover:bg-white/85 hover:scale-[1.03]"
        >
          <span>Menu</span>
          <TwoLineIcon size={16} />
        </button>
      </header>

      {/* Mega menu */}
      {open && (
        <>
          <div
            className="menu-backdrop fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[150]"
            onClick={close}
          />
          <div className="menu-panel fixed inset-0 md:inset-5 md:left-auto md:w-[min(860px,calc(100vw-40px))] bg-white z-[200] flex flex-col md:rounded-[10px] overflow-hidden shadow-[0_32px_80px_rgba(13,27,62,0.5)]">
            {/* Header: Close button on top left (mobile) / top right (desktop) */}
            <div className="flex items-center justify-between md:justify-end px-6 py-4 md:py-3">
              <button
                onClick={close}
                className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto -ml-2 md:ml-0 cursor-pointer transition-all duration-200 active:scale-95 bg-transparent border-none"
              >
                <X size={28} color="#2A3510" strokeWidth={1} className="md:w-6 md:h-6" />
                <span className="hidden md:inline font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#999] ml-2">
                  Close
                </span>
              </button>
            </div>

            {/* Panel body: 2-column split always */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column: Navigation Links */}
              <div className="no-scrollbar flex-[0_0_55%] md:flex-[0_0_42%] px-6 md:px-10 pb-10 overflow-y-auto md:border-r border-[#EDEAE6]">
                {(() => {
                  let idx = 0;
                  return SERVICE_GROUPS.map((group) => (
                    <div key={group.label} className="mb-10">
                      <p
                        className="nav-item-anim font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.25em] uppercase text-[#2A3510] mb-6"
                        style={{ animationDelay: `${idx++ * 0.04 + 0.1}s` }}
                      >
                        {group.label}
                      </p>

                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          className="group nav-item-anim flex items-center justify-between py-2.5 mb-1 no-underline"
                          style={{ animationDelay: `${idx++ * 0.04 + 0.1}s` }}
                        >
                          <span className="relative font-[family-name:var(--font-display)] text-[15px] sm:text-[18px] md:text-[21px] font-medium text-[#2A3510] leading-none">
                            {item.label}
                            <span className="absolute left-0 -bottom-1.5 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
                          </span>
                          <ChevronRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                            color="#2A3510/30"
                            strokeWidth={1.5}
                          />
                        </Link>
                      ))}
                    </div>
                  ));
                })()}
              </div>

              {/* Right Column: High-end Previews */}
              <div className="no-scrollbar flex-1 px-3 sm:px-6 pb-10 overflow-y-auto flex flex-col gap-5">
                {[
                  { name: "EXOTIC COLLECTION", img: PREVIEW_IMAGES[0] },
                  { name: "PREMIUM SUVS", img: PREVIEW_IMAGES[1] },
                  { name: "LUXURY SEDANS", img: PREVIEW_IMAGES[2] },
                ].map((item, i) => (
                  <div
                    key={item.name}
                    className="nav-item-anim relative aspect-[4/5] rounded-[4px] overflow-hidden group cursor-pointer"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-[family-name:var(--font-display)] text-[12px] sm:text-[16px] md:text-[22px] font-bold text-white tracking-wide">
                        {item.name}
                      </p>
                    </div>
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
