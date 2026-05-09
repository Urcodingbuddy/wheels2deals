"use client";

import { useState } from "react";
import Link from "next/link";
import { MegaMenu, TwoLineIcon } from "@/components/shared/MegaMenu";

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
        <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {[
            { label: "How it Works", href: "/how-it-works" },
            { label: "About Us", href: "/about" },
            { label: "Services", href: "/#services" },
            { label: "Reviews", href: "/#reviews" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative font-[family-name:var(--font-body)] text-[15px] font-normal tracking-[0.02em] text-white no-underline py-1"
            >
              {link.label}
              <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
            </Link>
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
      {open && <MegaMenu onClose={close} />}
    </>
  );
}
