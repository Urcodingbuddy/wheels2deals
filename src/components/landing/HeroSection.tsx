"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PremiumCTA } from "@/components/shared/PremiumCTA";

const HERO_VIDEO = "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero_video.mp4";
const HERO_POSTER = "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-images/hero-image/hero_image.webp";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => el.play().catch(() => {});
    const onVisibility = () => { if (!document.hidden) tryPlay(); };

    tryPlay();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section className="relative md:mx-3.5 md:mt-3.5 rounded-none md:rounded-[24px] overflow-hidden flex flex-col min-h-svh md:min-h-0 md:h-[calc(100svh-28px)]">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={HERO_POSTER}
        className="absolute inset-0 w-full h-full object-cover [object-position:30%_50%] md:object-center"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none" />

      {/* Center content — cards are inline on mobile, hidden on desktop */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-3 pt-24 pb-8 md:absolute md:flex-none md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:pt-0 md:pb-0">
        {/* Brand headline */}
        <h1
          className="hero-enter hero-enter-delay-2 font-[family-name:var(--font-display)] font-semibold leading-[0.95] tracking-[-0.04em] select-none"
          style={{ fontSize: "clamp(38px, 6vw, 80px)" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #F5D97A 0%, #C9A84C 40%, #F0C040 70%, #E8B84B 100%)",
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
              background: "linear-gradient(135deg, #F5D97A 0%, #C9A84C 40%, #F0C040 70%, #E8B84B 100%)",
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

        {/* Mobile cards — inline after tagline, hidden on desktop */}
        <div className="hero-enter hero-enter-delay-3 flex flex-row gap-2 w-full mt-1 md:hidden">
          <Link
            href="/buy"
            className="flex-1 min-w-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-3 active:bg-white/10"
          >
            <p className="font-[family-name:var(--font-display)] text-[16px] leading-[1.1] tracking-[-0.02em] text-white text-left">
              <span className="font-semibold text-[#C9A84C]">Want to Buy</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center self-end">
              <ArrowRight className="w-4 h-4 text-[#2A3510]" />
            </div>
          </Link>

          <Link
            href="/sell"
            className="flex-1 min-w-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-3 active:bg-white/10"
          >
            <p className="font-[family-name:var(--font-display)] text-[16px] leading-[1.1] tracking-[-0.02em] text-white text-left">
              <span className="font-semibold text-[#C9A84C]">Want to Sell</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center self-end">
              <ArrowRight className="w-4 h-4 text-[#2A3510]" />
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop cards — absolute at bottom, hidden on mobile */}
      <div className="hidden md:flex absolute bottom-3.5 left-3.5 right-3.5 flex-row justify-between z-10">
        <div className="hero-enter hero-enter-delay-3 w-[360px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
              <span className="font-semibold text-[#C9A84C]">Want to Buy</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-1.5">
              Browse verified listings across the UAE.
            </p>
          </div>
          <PremiumCTA href="/buy" text="Explore Listings" variant="outline" className="w-full !min-w-0" />
        </div>

        <div className="hero-enter hero-enter-delay-4 w-[360px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
          <div>
            <p className="font-[family-name:var(--font-display)] text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
              <span className="font-semibold text-[#C9A84C]">Want to Sell</span>
              <br />
              <span className="font-normal">a car?</span>
            </p>
            <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-1.5">
              Get your car&rsquo;s true value in minutes.
            </p>
          </div>
          <PremiumCTA href="/sell" text="Get Best Price" variant="outline" className="w-full !min-w-0" />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10">
        <span className="font-[family-name:var(--font-body)] text-[8.5px] font-semibold tracking-[0.24em] uppercase text-white/25 mb-1">
          Scroll
        </span>
        <div className="scroll-indicator" />
      </div>
    </section>
  );
}
