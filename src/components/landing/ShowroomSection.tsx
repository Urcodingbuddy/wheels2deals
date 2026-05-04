import Link from "next/link";
import { ShowroomCarousel } from "@/components/landing/ShowroomCarousel";

export function ShowroomSection() {
  return (
    <section className="py-20 px-10 bg-white">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="reveal flex items-end justify-between mb-14">
          <div>
            <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C9A84C] mb-3">
              In the showroom
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-extrabold text-[#0D1B3E] leading-[1.05]">
              Now Available
            </h2>
          </div>
          <Link
            href="/buy"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-[#0D1B3E] px-5 py-2.5 font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#0D1B3E] no-underline transition-all duration-200 hover:bg-[#0D1B3E] hover:text-white whitespace-nowrap"
          >
            View All →
          </Link>
        </div>

        <ShowroomCarousel />
      </div>
    </section>
  );
}
