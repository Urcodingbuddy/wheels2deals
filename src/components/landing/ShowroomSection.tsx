import Link from "next/link";
import { BlogsCarousel } from "@/components/landing/BlogsCarousel";

export function ShowroomSection() {
  return (
    <section className="py-20 px-10 bg-[var(--color-page-bg)]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="reveal flex items-end justify-between mb-14">
          <div className="flex flex-col items-start text-left">
            <p className="mb-3 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
              From the Blog
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-semibold text-[#2A3510] leading-[1.05] tracking-tight -ml-[3px]">
              Tips, Trends &amp; Insights
            </h2>
            <p className="mt-2 font-[family-name:var(--font-body)] text-[17px] text-[#2A3510]/58">
              The latest news and advice for car buyers and sellers in the UAE.
            </p>
          </div>
        </div>

        <BlogsCarousel />
      </div>
    </section>
  );
}
