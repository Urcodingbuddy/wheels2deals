import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Buy a Car",    href: "/buy" },
  { label: "Sell Your Car",href: "/sell" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Reviews",      href: "#reviews" },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function FooterSection() {
  return (
    <footer className="px-4 pb-4 pt-0 bg-[var(--color-page-bg)]">
      <div className="bg-[#2A3510] rounded-[20px] px-12 pt-14 pb-8 max-w-[1440px] mx-auto">

        {/* Main 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-20 pb-12 border-b border-white/10">

          {/* Left — CTA */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">
                <span className="w-1 h-1 rounded-full bg-[#C9A84C] inline-block" />
                Get in Touch
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(28px,3vw,42px)] font-extrabold text-white leading-[1.1] tracking-[-0.02em]">
                Are you ready<br />to get started?
              </h2>
            </div>
            <Link
              href="/buy"
              className="group inline-flex items-center justify-between gap-4 self-start rounded-full border border-white/20 bg-white/5 pl-6 pr-2 py-2 font-[family-name:var(--font-display)] text-[13px] font-bold text-white no-underline transition-all duration-300 hover:bg-white/10 hover:border-white/40 min-w-[200px]"
            >
              Explore Listings
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#2A3510] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          {/* Center — Navigation */}
          <div className="min-w-[160px]">
            <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4 pb-4 border-b border-white/10">
              Navigation
            </p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-body)] text-[14px] font-normal text-white/70 no-underline transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Office + Contact */}
          <div className="min-w-[200px] flex flex-col gap-8">
            <div>
              <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4 pb-4 border-b border-white/10">
                Visit Our Office
              </p>
              <p className="font-[family-name:var(--font-body)] text-[14px] text-white/70 leading-[1.6]">
                Business Bay, Dubai<br />United Arab Emirates
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-4">
                Contact Us
              </p>
              <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                <li className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 10.79a19.79 19.79 0 01-3.07-8.67A2 2 0 012.39 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                  </svg>
                  <a href="tel:+97142000000" className="font-[family-name:var(--font-body)] text-[14px] text-white/70 no-underline hover:text-white transition-colors">
                    +971 4 200 0000
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                  <a href="mailto:hello@wheels2deals.ae" className="font-[family-name:var(--font-body)] text-[14px] text-white/70 no-underline hover:text-white transition-colors">
                    hello@wheels2deals.ae
                  </a>
                </li>
              </ul>
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
