"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumCTA } from "@/components/shared/PremiumCTA";

const HERO_IMAGE = "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/hero-image/hero_image.webp";
const HERO_VIDEO = "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero_video.mp4";

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export function HeroSection() {
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="relative mx-3.5 mt-3.5 rounded-[24px] overflow-hidden flex flex-col min-h-[820px] md:min-h-0 md:h-[calc(100svh-28px)]">
      {/* Poster image — always visible as the base layer */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Video — skipped for reduced-motion users, fades in once buffered */}
      {!reducedMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Center text - flex-1 on mobile so it fills space above cards; absolute centered on desktop */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-3 pt-28 pb-12 md:absolute md:flex-none md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:pt-0 md:pb-0">
        {/* Brand headline */}
        <h1
          className="hero-enter hero-enter-delay-2 font-[family-name:var(--font-display)] font-semibold leading-[0.95] tracking-[-0.04em] select-none"
          style={{ fontSize: "clamp(38px, 6vw, 80px)" }}
        >
          <span
            style={{
              background:
                "linear-gradient(135deg, #F5D97A 0%, #C9A84C 40%, #F0C040 70%, #E8B84B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 24px rgba(201,168,76,0.45))",
            }}
          >
            Wheels
          </span>
          <span className="text-white/90">2</span>
          <span
            style={{
              background:
                "linear-gradient(135deg, #F5D97A 0%, #C9A84C 40%, #F0C040 70%, #E8B84B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 24px rgba(201,168,76,0.45))",
            }}
          >
            Deals
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="hero-enter hero-enter-delay-3 font-[family-name:var(--font-display)] font-normal text-white/70 leading-[1.4] tracking-[-0.01em]"
          style={{ fontSize: "clamp(14px, 2vw, 22px)", maxWidth: "540px" }}
        >
          The smartest bridge between{" "}
          <span className="text-white font-medium">buyers</span> and{" "}
          <span className="text-white font-medium">sellers</span>.
        </p>
      </div>

      {/* Bottom cards - in-flow on mobile (stacked), absolute on desktop (side-by-side) */}
      <div className="relative z-10 flex flex-col gap-3 p-3.5 pt-0 md:absolute md:bottom-3.5 md:left-3.5 md:right-3.5 md:p-0 md:flex-row md:justify-between">
        {/* Buying */}
        <div className="hero-enter hero-enter-delay-3 flex-1 md:flex-none md:w-[360px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-8 flex flex-col gap-4 md:gap-5">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[26px] md:text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
              <span className="font-semibold text-[#C9A84C]">Want to Buy</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-1.5">
              Browse verified listings across the UAE.
            </p>
          </div>
          <PremiumCTA
            href="/buy"
            text="Explore Listings"
            variant="outline"
            className="w-full !min-w-0"
          />
        </div>

        {/* Selling */}
        <div className="hero-enter hero-enter-delay-4 flex-1 md:flex-none md:w-[360px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-8 flex flex-col gap-4 md:gap-5">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[26px] md:text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
              <span className="font-semibold text-[#C9A84C]">Want to Sell</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-1.5">
              Get your car&rsquo;s true value in minutes.
            </p>
          </div>
          <PremiumCTA
            href="/sell"
            text="Get Best Price"
            variant="outline"
            className="w-full !min-w-0"
          />
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10">
        <span className="font-[family-name:var(--font-body)] text-[8.5px] font-semibold tracking-[0.24em] uppercase text-white/25 mb-1">
          Scroll
        </span>
        <div className="scroll-indicator" />
      </div>
    </section>
  );
}
