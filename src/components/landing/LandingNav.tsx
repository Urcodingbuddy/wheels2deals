"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

const SERVICE_GROUPS = [
  {
    label: "Buy & Sell",
    items: [
      {
        label: "Buy a Car",
        href: "/buy",
        title: "Find Your Next Car",
        sub: "Guided buying, end to end",
      },
      {
        label: "Sell Your Car",
        href: "/sell",
        title: "Sell With Confidence",
        sub: "Best price, minimum effort",
      },
      {
        label: "Finance & Loans",
        href: "/finance",
        title: "Drive Now, Pay Smart",
        sub: "Flexible plans, trusted lenders",
      },
    ],
  },
  {
    label: "Vehicle Services",
    items: [
      {
        label: "Inspection",
        href: "/inspect",
        title: "Know What You're Buying",
        sub: "Certified, unbiased assessments",
      },
      {
        label: "Insurance",
        href: "/insurance",
        title: "Stay Protected",
        sub: "Right coverage, competitive rates",
      },
      {
        label: "Transfer & Renewals",
        href: "/transfer",
        title: "Paperwork, Handled",
        sub: "Passing, registration & ownership",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        label: "About",
        href: "/about",
        title: "The W2D Story",
        sub: "Our mission and broker model",
      },
      {
        label: "Contact",
        href: "/contact",
        title: "Let's Talk Cars",
        sub: "Reach our team, anytime",
      },
    ],
  },
];

type Item = (typeof SERVICE_GROUPS)[0]["items"][0];

const DEFAULT: Item = {
  label: "",
  href: "/",
  title: "UAE's Car Broker",
  sub: "Buy. Sell. Service. One platform.",
};

const PREVIEW_CARDS = [
  {
    tag: "Buy & Sell",
    title: "Your Deal,\nOur Expertise",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
    accent: "#C9A84C",
  },
  {
    tag: "Vehicle Services",
    title: "Inspect.\nInsure. Transfer.",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop",
    accent: "#C9A84C",
  },
  {
    tag: "Company",
    title: "One Broker.\nEvery Deal.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&auto=format&fit=crop",
    accent: "#C9A84C",
  },
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
      <line x1="0" y1="2" x2="30" y2="2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="0" y1="13" x2="30" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Item>(DEFAULT);

  const close = () => {
    setOpen(false);
    setActive(DEFAULT);
  };

  return (
    <>

      {/* Navbar */}
      <header className="absolute top-10 left-0 right-0 z-[100] flex items-center justify-between px-10">

        {/* Left — logo only */}
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
            { label: "Services",     href: "#services"     },
            { label: "Reviews",      href: "#reviews"      },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-[family-name:var(--font-body)] text-[15px] font-normal tracking-[0.02em] text-white no-underline transition-colors duration-200 hover:text-white/70"
            >
              {link.label}
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
            className="menu-backdrop fixed inset-0 bg-[var(--color-page-bg)]/90 backdrop-blur-[8px] z-[150]"
            onClick={close}
          />

          <div className="menu-panel fixed top-5 left-5 bottom-5 w-[min(936px,calc(100vw-40px))] bg-white z-[200] flex flex-col rounded-[10px] overflow-hidden shadow-[0_32px_80px_rgba(13,27,62,0.5),0_0_0_1px_rgba(13,27,62,0.08)]">
            {/* Panel header */}
            <div className="flex items-center px-10 py-6 border-b border-[#EDEAE6]">
              <button
                onClick={close}
                className="flex items-center gap-3 cursor-pointer px-3 py-2 -ml-3 rounded-lg transition-colors duration-200 hover:bg-gray-100 bg-transparent border-none"
              >
                <X size={28} color="#BAC095" strokeWidth={1.5} />
                <span className="font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#999]">
                  Close
                </span>
              </button>
            </div>

            {/* Panel body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left nav rail */}
              <div className="no-scrollbar flex-[0_0_38%] px-10 pt-9 pb-10 overflow-y-auto border-r border-[#EDEAE6]">
                {(() => {
                  let idx = 0;
                  return SERVICE_GROUPS.map((group) => (
                    <div key={group.label} className="mb-9">
                      <p
                        className="nav-item-anim font-[family-name:var(--font-body)] text-[13px] font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-2"
                        style={{ animationDelay: `${idx++ * 0.06 + 0.15}s` }}
                      >
                        {group.label}
                      </p>

                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          onMouseEnter={() => setActive(item)}
                          onMouseLeave={() => setActive(DEFAULT)}
                          className="menu-rail-link nav-item-anim flex items-center justify-between py-[13px] border-b border-[#F2EFEb] no-underline"
                          style={{ animationDelay: `${idx++ * 0.06 + 0.15}s` }}
                        >
                          <span className="menu-rail-label font-[family-name:var(--font-display)] text-[21px] font-extrabold text-[#2A3510] tracking-[-0.01em] leading-none transition-colors duration-200">
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

              {/* Right — preview cards */}
              <div className="no-scrollbar flex-1 p-[28px_20px_28px_20px] flex flex-col gap-[20px] overflow-y-auto">
                {PREVIEW_CARDS.map((card, i) => (
                  <div
                    key={card.tag}
                    className="nav-item-anim flex-1 min-h-0 rounded-[12px] bg-cover bg-center relative overflow-hidden flex flex-col justify-end px-5 py-4"
                    style={{
                      backgroundImage: `url(${card.img})`,
                      animationDelay: `${0.2 + i * 0.1}s`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[var(--color-page-bg)]/30" />
                    <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-t from-[#BAC095d9] to-transparent" />

                    <div className="relative z-10">
                      <p
                        className="font-[family-name:var(--font-body)] text-[8px] font-bold tracking-[0.22em] uppercase mb-[6px]"
                        style={{ color: card.accent }}
                      >
                        {card.tag}
                      </p>
                      <h3 className="font-[family-name:var(--font-display)] text-[clamp(14px,1.6vw,20px)] font-extrabold text-white leading-[1.05] tracking-[-0.01em] whitespace-pre-line">
                        {card.title}
                      </h3>
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
