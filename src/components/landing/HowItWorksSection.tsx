export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BAC095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Tell Us What You Need",
      body: "Buying, selling, or need a service? Share your requirement in under a minute — no forms, no jargon.",
    },
    {
      num: "02",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BAC095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: "We Match the Right Partner",
      body: "Our team connects you with a vetted UAE dealer or service partner — the right one for your exact situation.",
    },
    {
      num: "03",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#BAC095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      title: "Close the Deal",
      body: "Meet your match, complete the transaction, and drive away. We handle the paperwork if you need us to.",
    },
  ];

  return (
    <section className="py-24 px-10 bg-[var(--color-page-bg)]">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <span className="inline-block font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.18em] uppercase text-white bg-[#1A6B72] px-4 py-1.5 rounded-full mb-5">
            How It Works
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] font-extrabold text-[#2A3510] leading-[1.1] tracking-[-0.01em] mb-4">
            One Platform. Every Car Deal.
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[16px] text-[#5A5A5A] max-w-[520px] mx-auto leading-[1.7]">
            We connect the right people, at the right time, with the right partners. You never pay a thing.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[1px] border-t-2 border-dashed border-[#C9A84C]/40 z-0" />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal reveal-delay-${i + 1} relative z-10 flex flex-col items-center text-center`}
            >
              {/* Number + icon circle */}
              <div className="relative mb-6">
                <div className="w-[104px] h-[104px] rounded-full bg-[#E8E4DC] flex items-center justify-center">
                  {step.icon}
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center">
                  <span className="font-[family-name:var(--font-body)] text-[10px] font-bold text-[#2A3510]">
                    {step.num}
                  </span>
                </div>
              </div>

              <h3 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-[#2A3510] mb-3 leading-[1.2]">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[14px] text-[#5A5A5A] leading-[1.65] max-w-[260px]">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="reveal text-center font-[family-name:var(--font-body)] text-[12px] text-[#5A5A5A]/60 mt-14 tracking-[0.04em]">
          Partners pay W2D per qualified connection &nbsp;·&nbsp; You always use W2D completely free
        </p>
      </div>
    </section>
  );
}
