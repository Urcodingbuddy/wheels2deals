"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      { label: "Car Detailing", href: "/detailing" },
      { label: "insurance", href: "/insurance" },
      { label: "Inspection & Transfer", href: "/inspection-and-transfer" },
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

const PREVIEW_CARDS = [
  { name: "EXOTIC COLLECTION", img: "/menu_exotic.png" },
  { name: "PREMIUM SUVS", img: "/menu_suv.png" },
  { name: "LUXURY SEDANS", img: "/menu_sedan.png" },
];

import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa6";

export function TwoLineIcon({ size }: { size: number }) {
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

export function MegaMenu({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const pageName = pathname === "/" ? "Home" : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || pathname;
  const whatsappText = encodeURIComponent(`Hi Wheels2Deals, I'm reaching out from the ${pageName} page and would like to know more about your services.`);

  return (
    <>
      <div
        className="menu-backdrop fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[150]"
        onClick={onClose}
      />
      <div className="menu-panel fixed inset-0 md:inset-5 md:left-auto md:w-[min(860px,calc(100vw-40px))] bg-white z-[200] flex flex-col md:rounded-[10px] overflow-hidden shadow-[0_32px_80px_rgba(13,27,62,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between md:justify-end px-6 py-4 md:py-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto -ml-2 md:ml-0 cursor-pointer transition-all duration-200 active:scale-95 bg-transparent border-none"
          >
            <X
              size={28}
              color="#2A3510"
              strokeWidth={1}
              className="md:w-6 md:h-6"
            />
            <span className="hidden md:inline font-[family-name:var(--font-body)] text-[10px] font-semibold tracking-[0.18em] uppercase text-[#999] ml-2">
              Close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — nav links */}
          <div className="no-scrollbar flex-[0_0_55%] md:flex-[0_0_42%] px-6 md:px-10 pb-10 overflow-y-auto md:border-r border-[#EDEAE6]">
            {SERVICE_GROUPS.map((group, gIdx) => (
              <div key={group.label} className="mb-10">
                <p
                  className="nav-item-anim font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.25em] uppercase text-[#2A3510] mb-6"
                  style={{ animationDelay: `${gIdx * 0.1 + 0.1}s` }}
                >
                  {group.label}
                </p>
                {group.items.map((item, iIdx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="group nav-item-anim flex items-center justify-between py-2.5 mb-1 no-underline"
                    style={{
                      animationDelay: `${gIdx * 0.1 + 0.1 + iIdx * 0.04}s`,
                    }}
                  >
                    <span className="relative font-[family-name:var(--font-display)] text-[15px] sm:text-[18px] md:text-[21px] font-medium text-[#2A3510] leading-none">
                      {item.label}
                      <span className="absolute left-0 -bottom-1.5 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
                    </span>
                    <ChevronRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                      color="#2A3510"
                      strokeWidth={1.5}
                    />
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Right — image cards */}
          <div className="no-scrollbar flex-1 px-3 sm:px-6 pb-10 overflow-y-auto flex flex-col gap-5">
            {PREVIEW_CARDS.map((card, i) => (
              <div
                key={card.name}
                className="nav-item-anim relative aspect-[3/5] rounded-[4px] overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-[family-name:var(--font-display)] text-[12px] sm:text-[16px] md:text-[22px] text-white tracking-wide">
                    {card.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer: Unified across both columns */}
        <div
          className="nav-item-anim px-6 md:px-10 py-6 border-t border-[#EDEAE6] flex items-center justify-between"
          style={{ animationDelay: "0.6s" }}
        >
          {/* Language Switcher 
          <div className="flex items-center gap-4">
            <button className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.25em] text-[#2A3510] border-b border-[#2A3510]">
              EN
            </button>
            <div className="w-[1px] h-3 bg-[#2A3510]/20" />
            <button className="font-[family-name:var(--font-body)] text-[12px] font-bold tracking-[0.25em] text-[#2A3510]/80 hover:text-[#2A3510] transition-colors uppercase">
              العربية
            </button>
          </div>
          */}
          <div />

          {/* Social Links */}
          <div className="flex gap-8">
            <a
              href={`https://wa.me/971501568003?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A3510] hover:text-[#C9A84C] transition-all hover:-translate-y-1"
            >
              <FaWhatsapp className="w-7 h-7" />
            </a>
            <a
              href="https://www.instagram.com/wheels2dealsfze/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A3510] hover:text-[#C9A84C] transition-all hover:-translate-y-1"
            >
              <FaInstagram className="w-7 h-7" />
            </a>
            <a
              href="https://www.facebook.com/people/Wheels2Deals/100052648911178/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A3510] hover:text-[#C9A84C] transition-all hover:-translate-y-1"
            >
              <FaFacebookF className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
