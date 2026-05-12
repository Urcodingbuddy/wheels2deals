"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    label: "Economy Cars",
    count: 16,
    href: "/buy?category=economy",
    img: "/car_01.png",
  },
  {
    label: "Exotic Cars",
    count: 8,
    href: "/buy?category=exotic",
    img: "/car_02.png",
  },
  {
    label: "Sport Cars",
    count: 16,
    href: "/buy?category=sports",
    img: "/car_03.png",
  },
  {
    label: "Luxury Cars",
    count: 24,
    href: "/buy?category=luxury",
    img: "/car_04.png",
  },
  { label: "SUVs", count: 9, href: "/buy?category=suv", img: "/car_05.png" },
];

const SCALES = [0.5, 0.62, 0.78, 1.0, 0.78, 0.62, 0.5];
const OPACITIES = [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0];
const SLOT_GAP = 280; // slightly wider for larger mobile cards

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function CategoryCarousel() {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = CATEGORIES.length;

  function getPos(idx: number): number {
    let p = mod(idx - active, total);
    if (p > Math.floor(total / 2)) p -= total;
    return p;
  }

  const prev = () => setActive((a) => mod(a - 1, total));
  const next = () => setActive((a) => mod(a + 1, total));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe distance of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track */}
      <div className="relative h-[400px] overflow-hidden">
        {CATEGORIES.map((cat, idx) => {
          const pos = getPos(idx);
          if (Math.abs(pos) > 3) return null;

          const si = pos + 3;
          const scale = SCALES[si];
          const opacity = OPACITIES[si];
          const xOffset = pos * SLOT_GAP;
          const zIndex = 5 - Math.abs(pos);
          const isActive = pos === 0;

          return (
            <div
              key={cat.label}
              onClick={() => !isActive && setActive(idx)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "280px",
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) scale(${scale})`,
                opacity,
                zIndex,
                transition:
                  "transform 0.58s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.58s ease",
                cursor: isActive ? "default" : "pointer",
                pointerEvents: Math.abs(pos) >= 3 ? "none" : "auto",
              }}
            >
              {/* Card */}
              <Link
                href={cat.href}
                className="relative h-[360px] rounded-2xl border border-[#e8e8e8] bg-white flex flex-col items-center justify-center p-6 no-underline transition-all duration-300 hover:border-[#C9A84C]"
              >
                {/* Car image */}
                <div className="w-full h-[180px] mb-8 flex items-center justify-center">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-[#2A3510] mb-3">
                    {cat.label}
                  </h3>
                  <span className="inline-flex items-center justify-center rounded-full px-5 py-2 font-[family-name:var(--font-body)] text-[13px] font-semibold bg-[#f2f2f2] text-[#666]">
                    {cat.count} Cars
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-4">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A3510]/20 text-[#2A3510]/40 transition-all hover:border-[#2A3510] hover:text-[#2A3510]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-[7px]">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-1.5 h-1.5 rounded-full bg-transparent transition-all duration-300"
              style={{
                width: active === i ? "20px" : "6px",
                height: "6px",
                backgroundColor: active === i ? "#2A3510" : "rgba(42,53,16,0.2)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A3510]/20 text-[#2A3510]/40 transition-all hover:border-[#2A3510] hover:text-[#2A3510]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
