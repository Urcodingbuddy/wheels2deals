import { AppSection } from "@/components/app/AppSection";
import { AppCard } from "@/components/app/AppCard";

export default function BuyPage() {
  return (
    <>
      {/* ── Page header ── */}
      <AppSection spacing="tight" className="border-b border-white/[0.06]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-[#1A6B3C] mb-1">
              Inventory
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,4vw,44px)] font-extrabold uppercase tracking-[-0.01em] text-white leading-none">
              Browse Cars
            </h1>
          </div>
          <span className="font-[family-name:var(--font-body)] text-[12px] text-white/30 pb-1">
            0 listings
          </span>
        </div>
      </AppSection>

      {/* ── Filters row ── */}
      <AppSection spacing="tight" className="border-b border-white/[0.06]">
        <div className="flex flex-wrap gap-2">
          {["All", "SUV", "Sedan", "Coupe", "Electric"].map((f) => (
            <button
              key={f}
              className="px-4 py-1.5 rounded-full border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.22] font-[family-name:var(--font-body)] text-[11.5px] font-medium transition-all duration-150 cursor-pointer bg-transparent first:bg-white/[0.07] first:text-white first:border-white/[0.18]"
            >
              {f}
            </button>
          ))}
        </div>
      </AppSection>

      {/* ── Car grid ── */}
      <AppSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Placeholder cards */}
          {Array.from({ length: 6 }).map((_, i) => (
            <AppCard key={i} as="article">
              {/* Image placeholder */}
              <div className="w-full aspect-[16/10] rounded-xl bg-white/[0.04] border border-white/[0.06] mb-4 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-[family-name:var(--font-body)] text-[11px] text-white/20 tracking-widest uppercase">
                    Photo
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-[family-name:var(--font-display)] text-[18px] font-extrabold uppercase tracking-[-0.01em] text-white leading-tight">
                  Car Title
                </p>
                <span className="shrink-0 font-[family-name:var(--font-body)] text-[11px] font-bold text-[#C8981A] bg-[#C8981A]/10 rounded-md px-2 py-0.5">
                  AED —
                </span>
              </div>
              <p className="font-[family-name:var(--font-body)] text-[12px] text-white/35">
                Year · Fuel · km
              </p>
            </AppCard>
          ))}
        </div>
      </AppSection>
    </>
  );
}
