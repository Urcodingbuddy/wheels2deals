import Link from "next/link";

const HERO_WEBM =
  "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero.webm";
const HERO_MP4 =
  "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/cars_compressed.mp4";

export function HeroSection() {
  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center scale-[1.3]"
      >
        <source src={HERO_WEBM} type="video/webm" />
        <source src={HERO_MP4} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#08080880]" />

      {/* Bottom gradient fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#080808] to-transparent" />

      {/* Hero content — centered, slightly below midpoint */}
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-6 z-[2]">
        {/* Eyebrow */}
        <p className="hero-enter hero-enter-delay-1 font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.28em] uppercase text-[#1A6B3C] mb-8">
          Premium Pre-Owned &nbsp;·&nbsp; UAE
        </p>

        {/* Headline */}
        <h1 className="hero-enter hero-enter-delay-2 font-[family-name:var(--font-display)] text-[clamp(40px,7vw,96px)] font-extrabold uppercase leading-[0.92] tracking-[-0.025em] text-white mb-7">
          Driven
          <br />
          By
          <br />
          <span className="text-white/20">Legends.</span>
        </h1>

        {/* Supporting line */}
        <p className="hero-enter hero-enter-delay-3 font-[family-name:var(--font-body)] text-[clamp(14px,1.5vw,16px)] font-normal text-[#AAAAAA] max-w-[380px] mx-auto mb-11 leading-[1.65]">
          Curated supercars and luxury machines, personally verified. No
          surprises. No haggling.
        </p>

        {/* Pill CTA */}
        <div className="hero-enter hero-enter-delay-4">
          <Link
            href="/inventory"
            className="hero-cta inline-block font-[family-name:var(--font-body)] text-[11px] font-medium tracking-[0.2em] uppercase text-white border-[1.5px] border-white/45 rounded-full px-[52px] py-[14px] no-underline"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2]">
        <span className="font-[family-name:var(--font-body)] text-[9px] font-semibold tracking-[0.2em] uppercase text-white/20 mb-2">
          Scroll
        </span>
        <div className="scroll-indicator" />
      </div>
    </section>
  );
}
