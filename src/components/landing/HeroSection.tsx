import Link from "next/link";

const HERO_IMAGE =
  "./blue_car_hero.webp";

function ArrowIcon() {
  return (
    <svg
      width="13" height="13"
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
  return (
    <section className="relative h-[calc(100svh-28px)] min-h-[620px] overflow-hidden flex items-center justify-center mx-3.5 mt-3.5 rounded-[24px]">
      {/* Blue car image */}
      <img
        src={HERO_IMAGE}
        alt="Hero car"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* ── Dark overlay for text legibility ── */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 flex flex-col items-center text-center px-6 gap-3">

        {/* Eyebrow label */}
        <span className="hero-enter hero-enter-delay-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          UAE&apos;s Premier Auto Marketplace
        </span>

        {/* Brand name — the star of the show */}
        <h1 className="hero-enter hero-enter-delay-2 font-[family-name:var(--font-display)] font-extrabold leading-[0.95] tracking-[-0.04em] select-none"
          style={{ fontSize: "clamp(38px, 6vw, 80px)" }}>
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
        <p className="hero-enter hero-enter-delay-3 font-[family-name:var(--font-display)] font-normal text-white/70 leading-[1.4] tracking-[-0.01em]"
          style={{ fontSize: "clamp(15px, 2vw, 22px)", maxWidth: "540px" }}>
          The smartest bridge between{" "}
          <span className="text-white font-medium">buyers</span> and{" "}
          <span className="text-white font-medium">sellers</span>.
        </p>
      </div>

      {/* ── Bottom-left card — Buying ── */}
      <div className="hero-enter hero-enter-delay-3 absolute bottom-3.5 left-3.5 w-[min(420px,46%)] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-5 z-10">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
            <span className="font-extrabold text-[#C9A84C]">Buying</span>{" "}
            <span className="font-normal">a car?</span>
          </p>
          <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-2">
            Browse verified listings across the UAE.
          </p>
        </div>
        <Link
          href="/buy"
          className="group/btn inline-flex items-center justify-between gap-3 rounded-full bg-white/15 border border-white/25 pl-6 pr-1.5 py-1.5 font-[family-name:var(--font-display)] text-[12px] font-bold tracking-[0.04em] text-white no-underline transition-colors duration-200 hover:bg-white/25 w-full backdrop-blur-sm"
        >
          Explore Listings
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#2A3510] flex-shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
            <ArrowIcon />
          </span>
        </Link>
      </div>

      {/* ── Bottom-right card — Selling ── */}
      <div className="hero-enter hero-enter-delay-4 absolute bottom-3.5 right-3.5 w-[min(420px,46%)] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-5 z-10">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[36px] leading-[1.05] tracking-[-0.02em] text-white">
            <span className="font-extrabold text-[#C9A84C]">Selling</span>{" "}
            <span className="font-normal">a car?</span>
          </p>
          <p className="font-[family-name:var(--font-body)] text-[12px] text-white/55 leading-[1.6] mt-2">
            Get your car's true value in minutes.
          </p>
        </div>
        <Link
          href="/sell"
          className="group/btn inline-flex items-center justify-between gap-3 rounded-full bg-white/15 border border-white/25 pl-6 pr-1.5 py-1.5 font-[family-name:var(--font-display)] text-[12px] font-bold tracking-[0.04em] text-white no-underline transition-colors duration-200 hover:bg-white/25 w-full backdrop-blur-sm"
        >
          Get Best Price
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#2A3510] flex-shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
            <ArrowIcon />
          </span>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-[family-name:var(--font-body)] text-[8.5px] font-semibold tracking-[0.24em] uppercase text-white/25 mb-1">
          Scroll
        </span>
        <div className="scroll-indicator" />
      </div>
    </section>
  );
}
