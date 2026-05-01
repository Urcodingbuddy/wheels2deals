import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-[140px] px-10 text-center">
      <div className="max-w-[700px] mx-auto">
        <p className="reveal font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.25em] uppercase text-[#1A6B3C] mb-6">
          Ready to Find Yours?
        </p>
        <h2 className="reveal reveal-delay-1 font-[family-name:var(--font-display)] text-[clamp(36px,5.5vw,72px)] font-extrabold uppercase leading-[0.92] text-white tracking-[-0.02em] mb-9">
          Find Your
          <br />
          <span className="text-white/15">Next Car.</span>
        </h2>
        <p className="reveal reveal-delay-2 font-[family-name:var(--font-body)] text-[15px] font-normal text-[#aaaaaa] leading-[1.7] mb-12">
          Browse our current inventory or get in touch — we&apos;ll help you find exactly what you&apos;re looking for.
        </p>
        <div className="reveal reveal-delay-3 flex flex-wrap justify-center gap-4">
          <Link
            href="/inventory"
            className="font-[family-name:var(--font-body)] text-[13px] font-medium tracking-[0.04em] text-black bg-white rounded-[4px] px-9 py-[14px] no-underline transition-colors duration-[150ms] hover:bg-gray-100"
          >
            Browse Inventory
          </Link>
          <Link
            href="/contact"
            className="font-[family-name:var(--font-body)] text-[13px] font-medium tracking-[0.04em] text-white bg-transparent border-[1.5px] border-white/20 rounded-[4px] px-9 py-[14px] no-underline transition-colors duration-[150ms] hover:border-white/40"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
