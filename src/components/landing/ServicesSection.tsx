import Link from "next/link";

const SERVICES = [
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
    label: "BUY A CAR",
    title: "Buy a Car",
    body: "Find your perfect match from verified dealers across the UAE. Guided buying from search to handover.",
    href: "/buy",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    label: "SELL YOUR CAR",
    title: "Sell Your Car",
    body: "Get the best price without the hassle. We connect you to the right buyers — same-week deals.",
    href: "/sell",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    label: "FINANCE",
    title: "Finance & Loans",
    body: "Drive now, pay smart. We match you with UAE's top finance partners and negotiate the best rates.",
    href: "/finance",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "INSPECTION",
    title: "RTA Inspection",
    body: "Know exactly what you're buying. RTA-approved inspection centres, unbiased 150-point reports.",
    href: "/inspect",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 7 23 1 17 1" />
        <path d="M23 1l-7 7" />
        <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
        <path d="M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
    ),
    label: "INSURANCE",
    title: "Car Insurance",
    body: "Best UAE rates, top providers, instant quotes. Full coverage in minutes. We compare so you don't have to.",
    href: "/insurance",
  },
  {
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    label: "TRANSFER",
    title: "Transfer & Renewals",
    body: "Ownership transfers, Mulkiya renewals, RTA paperwork — handled same day so you don't have to queue.",
    href: "/transfer",
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 px-10 bg-[var(--color-page-bg)]">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-4">
              Our Services
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] font-semibold text-white leading-[1.05] tracking-[-0.01em]">
              Everything You Need.
              <br />
              <span className="text-[#C9A84C]">One Broker.</span>
            </h2>
          </div>
          <p className="font-[family-name:var(--font-body)] text-[14px] text-white/55 max-w-[320px] leading-[1.7] md:text-right">
            From finding your car to insuring it and transferring ownership —
            W2D handles every step.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              className={`reveal reveal-delay-${(i % 3) + 1} group relative bg-white/[0.05] border border-[#C9A84C]/20 rounded-lg p-7 no-underline transition-all duration-300 hover:bg-white/[0.09] hover:border-[#C9A84C]/50 hover:-translate-y-1 block`}
              style={{ borderTopWidth: "2px", borderTopColor: "#C9A84C" }}
            >
              <div className="mb-5">{s.icon}</div>
              <p className="font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.18em] text-[#C9A84C] mb-2">
                {s.label}
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-white mb-3 leading-[1.2]">
                {s.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[13px] text-white/55 leading-[1.65] mb-5">
                {s.body}
              </p>
              <span className="font-[family-name:var(--font-body)] text-[12px] font-semibold text-[#C9A84C] tracking-[0.06em] flex items-center gap-1.5 transition-gap duration-200 group-hover:gap-2.5">
                Learn more
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
