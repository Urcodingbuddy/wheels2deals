import Link from "next/link";
import { ShowroomCarousel } from "@/components/landing/ShowroomCarousel";

export function ShowroomSection() {
  return (
    <section className="py-30 px-10">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="reveal flex items-end justify-between mb-14">
          <div>
            <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1A6B3C] mb-3">
              In the showroom
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(48px,5vw,64px)] font-extrabold uppercase text-white leading-none tracking-[-0.01em]">
              Now Available
            </h2>
          </div>
          <Link
            href="/inventory"
            className="font-[family-name:var(--font-body)] text-[12px] font-medium tracking-[0.12em] uppercase text-white/60 no-underline border-b border-white/20 pb-1 transition-colors duration-200 hover:text-white hover:border-white"
          >
            View All →
          </Link>
        </div>

        <ShowroomCarousel />
      </div>
    </section>
  );
}
