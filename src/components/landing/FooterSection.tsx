import Link from "next/link";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Buy a Car", href: "/buy" },
  { label: "Sell Your Car", href: "/sell" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
];

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function FooterSection() {
  return (
    <footer className="px-3.5 pb-10 pt-0 bg-[var(--color-page-bg)]">
      <div className="relative bg-[#2A3510] rounded-[24px] px-6 md:px-12 pt-14 md:pt-20 pb-8 max-w-[1440px] mx-auto overflow-hidden">
        {/* Large Decal Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] w-[75%] h-auto">
          <img
            src="/logo.svg"
            alt=""
            className="w-full h-auto brightness-0 invert"
          />
        </div>

        {/* Main grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-20 pb-10 border-b border-white/10">
          {/* Left — CTA */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div>
              <p className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 md:mb-5">
                <span className="w-1 h-1 rounded-full bg-[#C9A84C] inline-block" />
                Get in Touch
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[28px] md:text-[clamp(28px,3vw,42px)] font-semibold text-white leading-[1.1] tracking-[-0.02em]">
                Are you ready
                <br />
                to get started?
              </h2>
            </div>
            <Link
              href="/buy"
              className="group inline-flex items-center justify-between gap-4 self-start rounded-full border border-white/20 bg-white/5 pl-6 pr-2 py-2 font-[family-name:var(--font-display)] text-[13px] font-bold text-white no-underline transition-all duration-300 hover:bg-white/10 hover:border-white/40 min-w-[190px] md:min-w-[200px]"
            >
              Explore Listings
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#2A3510] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          {/* Right — Info Grid (2 cols on mobile) */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-8 md:gap-20">
            {/* Navigation */}
            <div className="min-w-[120px] md:min-w-[160px]">
              <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4 pb-3 md:pb-4 border-b border-white/10">
                Links
              </p>
              <ul className="flex flex-col gap-2.5 md:gap-3 list-none p-0 m-0">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-[family-name:var(--font-body)] text-[13px] md:text-[14px] font-normal text-white/70 no-underline transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Office & Contact */}
            <div className="flex flex-col gap-8 min-w-[140px] md:min-w-[200px]">
              <div>
                <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4 pb-3 md:pb-4 border-b border-white/10">
                  Office
                </p>
                <p className="font-[family-name:var(--font-body)] text-[13px] md:text-[14px] text-white/70 leading-[1.5] md:leading-[1.6]">
                  Business Bay, Dubai
                  <br />
                  UAE
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-3">
                  Contact
                </p>
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                  <li className="flex items-center gap-2">
                    <a
                      href="tel:+97142000000"
                      className="font-[family-name:var(--font-body)] text-[13px] md:text-[14px] text-white/70 no-underline hover:text-white transition-colors"
                    >
                      +971 4 200 0000
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <a
                      href="mailto:hello@wheels2deals.ae"
                      className="font-[family-name:var(--font-body)] text-[13px] md:text-[14px] text-white/70 no-underline hover:text-white transition-colors truncate max-w-[140px] md:max-w-none"
                    >
                      Email Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-7 gap-4 flex-wrap">
          <p className="font-[family-name:var(--font-body)] text-[12px] text-white/30">
            © 2026 Wheels2Deals. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-[family-name:var(--font-body)] text-[12px] font-medium text-white/40 no-underline transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
