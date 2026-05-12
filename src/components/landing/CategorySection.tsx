"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

const CATEGORIES = [
  {
    label: "Economy Cars",
    href: "/buy?category=economy",
    img: "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/site_images/Economy_car.webp",
  },
  {
    label: "Sports Cars",
    href: "/buy?category=sports",
    img: "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/site_images/Sports_car.webp",
  },
  {
    label: "SUV Cars",
    href: "/buy?category=suv",
    img: "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/site_images/SUV_car.webp",
  },
  {
    label: "Luxury Cars",
    href: "/buy?category=luxury",
    img: "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/site_images/Luxury_car.webp",
  },
  {
    label: "Exotic Cars",
    href: "/buy?category=exotic",
    img: "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/site_images/Exotic_car.webp",
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
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15 transition-opacity duration-300 group-hover:opacity-0" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#2A3510]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink
                  size={32}
                  className="text-white/90"
                  strokeWidth={1.5}
                />
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

        {/* Desktop View: equal-width cards, GPU-only animations */}
        <div className="hidden md:flex gap-3 h-[440px]">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="reveal group relative flex-1 rounded-[10px] overflow-hidden no-underline block"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              {/* Image - GPU zoom */}
              <img
                src={cat.img}
                alt={cat.label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                style={{ willChange: "transform" }}
              />

              {/* Permanent bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Olive tint overlay - GPU opacity */}
              <div className="absolute inset-0 bg-[#2A3510]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 z-10">
                {/* Gold bar - draws left→right via scaleX (GPU transform) */}
                <div
                  className="h-[2px] w-8 bg-[#C9A84C] mb-2.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
                  style={{ transitionDelay: "0.05s" }}
                />
                <div className="flex items-end justify-between gap-2">
                  {/* Label lifts on hover */}
                  <span className="font-[family-name:var(--font-display)] text-[clamp(16px,1.3vw,21px)] font-bold text-white leading-tight translate-y-1 group-hover:translate-y-0 transition-transform duration-400 ease-out">
                    {cat.label}
                  </span>
                  {/* Icon scales in */}
                  <ExternalLink
                    size={15}
                    strokeWidth={1.8}
                    className="text-white/0 group-hover:text-[#C9A84C] scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out shrink-0 mb-0.5"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
