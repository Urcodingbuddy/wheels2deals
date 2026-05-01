"use client";

import { useState } from "react";
import Link from "next/link";
import { User, X, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Buy a Car", href: "/buy" },
  { label: "Sell Your Car", href: "/sell" },
  { label: "Finance", href: "/finance" },
  { label: "Inspection", href: "/inspect" },
  { label: "Insurance", href: "/insurance" },
  { label: "Transfer", href: "/transfer" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function TwoLineIcon() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
      <line x1="0" y1="1.5" x2="18" y2="1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="0" y1="8.5" x2="18" y2="8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AppNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Sticky navbar ── */}
      <header className="sticky top-0 z-50 h-[60px] bg-[#000000]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="h-full max-w-[1280px] mx-auto px-6 flex items-center justify-between relative">

          {/* Left — Menu button */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="flex items-center gap-[7px] px-3 py-[7px] rounded-lg text-white/55 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.1] transition-all duration-200 cursor-pointer bg-transparent"
          >
            <TwoLineIcon />
            <span className="font-[family-name:var(--font-body)] text-[10.5px] font-semibold tracking-[0.15em] uppercase">
              Menu
            </span>
          </button>

          {/* Center — Logo (absolute so it's always perfectly centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <Link href="/" className="block pointer-events-auto" aria-label="Wheels2Deals home">
              <img
                src="/logo.svg"
                alt="Wheels2Deals"
                className="h-[36px] w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            </Link>
          </div>

          {/* Right — Profile button */}
          <Link
            href="/profile"
            aria-label="Your profile"
            className="flex items-center gap-[7px] px-3 py-[7px] rounded-lg text-white/55 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/[0.1] transition-all duration-200"
          >
            <span className="font-[family-name:var(--font-body)] text-[10.5px] font-semibold tracking-[0.15em] uppercase">
              Profile
            </span>
            <User size={16} strokeWidth={1.6} />
          </Link>
        </div>
      </header>

      {/* ── Slide-in nav drawer ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-4 left-4 bottom-4 w-[300px] bg-[#171717] border border-white/[0.08] rounded-2xl z-[200] flex flex-col overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-white/40">
                Navigate
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-200 cursor-pointer bg-transparent border-none"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-150 no-underline group"
                >
                  <span className="font-[family-name:var(--font-body)] text-[13.5px] font-medium">
                    {link.label}
                  </span>
                  <ChevronRight
                    size={13}
                    strokeWidth={1.5}
                    className="text-white/20 group-hover:text-white/50 transition-colors duration-150"
                  />
                </Link>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-white/[0.06]">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#1A6B3C] text-white text-[12px] font-semibold tracking-[0.1em] uppercase font-[family-name:var(--font-body)] hover:bg-[#1d7a45] transition-colors duration-200 no-underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
