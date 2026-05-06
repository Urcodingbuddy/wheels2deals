"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const CATEGORIES = [
  {
    label: "Economy Cars",
    href: "/buy?type=economy",
    img: "/categories_images/Economy_car.png",
  },
  {
    label: "Sports Cars",
    href: "/buy?type=sport",
    img: "/categories_images/Sports_car.png",
  },
  {
    label: "SUV Cars",
    href: "/buy?type=suv",
    img: "/categories_images/SUV_car.png",
  },
  {
    label: "Luxury Cars",
    href: "/buy?type=luxury",
    img: "/categories_images/Luxury_car.png",
  },
  {
    label: "Pickup Trucks",
    href: "/buy?type=pickup",
    img: "/categories_images/Pickup_Truck_car.png",
  },
];

export function CategorySection() {
  return (
    <section className="pt-20 pb-4 px-3.5 bg-[var(--color-page-bg)]">
      <div className="max-w-[1440px] mx-auto">
        {/* Header row */}
        <div className="reveal flex flex-col items-start text-left mb-12">
          <p className="mb-3 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C5A846]">
            Top Categories
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-semibold text-[#2A3510] leading-[1.05] tracking-tight -ml-[3px]">
            Selected top-rated cars
          </h2>
          <p className="mt-2 font-[family-name:var(--font-body)] text-[17px] text-[#2A3510]/58">
            Browse verified listings across every category in the UAE
          </p>
        </div>

        {/* Mobile View: Horizontal Scroll */}
        <div className="flex md:hidden overflow-x-auto overflow-y-hidden gap-4 pb-4 no-scrollbar -mx-3.5 px-3.5 snap-x snap-mandatory">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex-shrink-0 w-[260px] snap-center relative rounded-[8px] overflow-hidden no-underline block aspect-[3/4]"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15 transition-opacity duration-300 group-hover:opacity-0" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#2A3510]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink size={32} className="text-white/90" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 flex items-center justify-between z-10">
                <span className="relative font-[family-name:var(--font-display)] text-[20px] font-bold text-white leading-tight py-0.5">
                  {cat.label}
                  <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
                </span>
                <ArrowRight
                  size={20}
                  className="text-white/80 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop View: Flex accordion — hovered card expands */}
        <div className="hidden md:flex gap-4 h-[420px] category-accordion">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="reveal group relative rounded-[8px] overflow-hidden no-underline block flex-1 hover:flex-[3]"
              style={{ transition: "flex-grow 1s cubic-bezier(0.22, 1, 0.36, 1)", willChange: "flex-grow" }}
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15 transition-opacity duration-300 group-hover:opacity-0" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#2A3510]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink size={36} className="text-white/90" strokeWidth={1.5} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 flex items-center gap-3 z-10">
                <span className="relative font-[family-name:var(--font-display)] text-[clamp(20px,1.6vw,26px)] font-bold text-white leading-tight py-0.5 whitespace-nowrap">
                  {cat.label}
                  <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
                </span>
                <ArrowRight
                  size={22}
                  className="text-white/80 group-hover:translate-x-1.5 transition-transform duration-300"
                  strokeWidth={2}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
