"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { BannerCursorImage } from "@/components/landing/BannerCursorImage";

export function BannerSection() {
  const cardRef    = useRef<HTMLDivElement>(null);
  const cursorRef  = useRef<HTMLDivElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Capsule follows cursor
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        left: x,
        top: y,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      });
    }

    // Image drifts subtly toward cursor
    if (imageRef.current) {
      const nx = (x - rect.width  / 2) / (rect.width  / 2); // -1 → 1
      const ny = (y - rect.height / 2) / (rect.height / 2); // -1 → 1
      gsap.to(imageRef.current, {
        x: nx * 18,
        y: ny * 11,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }

  function handleMouseLeave() {
    setVisible(false);
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        duration: 1.6,
        ease: "elastic.out(1, 0.35)",
      });
    }
  }

  return (
    <section className="relative px-10 py-30">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={handleMouseLeave}
        className="reveal max-w-[1160px] mx-auto flex flex-col md:flex-row rounded-[12px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10 cursor-none"
      >
        {/* Cursor capsule */}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute z-50"
          style={{
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md pl-5 pr-2 py-2">
            <span className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.14em] uppercase text-white whitespace-nowrap">
              Explore
            </span>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Left side: Text */}
        <div className="w-full md:w-[45%] bg-[#151515] p-14 md:p-20 flex flex-col justify-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3vw,36px)] font-bold text-white mb-6 leading-[1.1]">
            Find your new or pre-owned vehicle.
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[13px] text-[#e0e0e0] leading-[1.6]">
            A premium vehicle is as individual as its owner. It is always an
            expression of one's own personality. We help you find your personal
            dream vehicle from our curated collection of verified models.
          </p>
        </div>

        {/* Right side: Image */}
        <BannerCursorImage ref={imageRef} />
      </div>
    </section>
  );
}
