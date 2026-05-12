import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";

export default function PrivacyPage() {
  const effectiveDate = "May 12, 2026";

  return (
    <main className="relative min-h-screen bg-[var(--color-page-bg)] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      {/* Hero & Content Wrapper */}
      <div className="bg-[#2A3510] rounded-b-[40px] md:rounded-b-[60px] pb-32 relative overflow-hidden">
        {/* Fixed Background Image */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url('/services_bg.jpg')` }}
        />

        {/* Fixed Overlay for Readability */}
        <div className="fixed inset-0 bg-gradient-to-b from-[#2A3510]/50 via-[#2A3510]/70 to-[#2A3510]/90" />

        {/* Header Section */}
        <section className="relative z-10 pt-40 pb-16 px-6">
          <div className="max-w-[1000px] mx-auto text-center md:text-left">
            <span className="mb-4 inline-block font-[family-name:var(--font-body)] text-[14px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
              Privacy & Data Protection
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Privacy Policy
            </h1>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="font-[family-name:var(--font-body)] text-[12px] font-medium text-white/60">
                Effective Date:
              </span>
              <span className="font-[family-name:var(--font-body)] text-[12px] font-bold text-[#C9A84C]">
                {effectiveDate}
              </span>
            </div>
          </div>
        </section>

        {/* Legal Text Section */}
        <section className="relative z-10 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="space-y-16">
              {/* 1. Introduction */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    1
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Introduction
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed space-y-4 text-lg">
                  <p>
                    Wheels2Deals (&quot;Wheels2Deals&quot;, &quot;we&quot;,
                    &quot;us&quot;, or &quot;our&quot;) respects your privacy
                    and is committed to protecting your personal data. This
                    Privacy Policy explains how we collect, use, disclose,
                    store, and protect personal information when you visit our
                    website{" "}
                    <a
                      href="https://www.wheels2deals.com"
                      className="text-[#C9A84C] hover:underline"
                    >
                      https://www.wheels2deals.com
                    </a>{" "}
                    (the &quot;Website&quot;) or use our services (the
                    &quot;Services&quot;).
                  </p>
                  <p>
                    This Privacy Policy is issued in accordance with applicable
                    laws of the United Arab Emirates, including UAE Federal
                    Decree-Law No. 45 of 2021 on the Protection of Personal Data
                    (the &quot;PDPL&quot;) and any related regulations issued by
                    the UAE Data Office.
                  </p>
                  <p>
                    By using the Website or Services, you confirm that you have
                    read, understood, and consent to the collection, use, and
                    disclosure of your personal information as described in this
                    Privacy Policy.
                  </p>
                </div>
              </div>

              {/* 2. Who We Are */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    2
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Who We Are
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed space-y-4 text-lg">
                  <p>
                    Wheels2Deals is a UAE-based automotive brokerage platform
                    that connects buyers and sellers of vehicles and provides
                    related services.
                  </p>
                  <div className="mt-8 grid sm:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[#C9A84C] font-bold mb-4 uppercase tracking-wider text-xs">
                        Data Controller
                      </h3>
                      <p className="text-white font-bold mb-1">Wheels2Deals</p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        SIT Tower, Dubai Silicon Oasis,
                        <br />
                        Dubai, United Arab Emirates
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[#C9A84C] font-bold mb-4 uppercase tracking-wider text-xs">
                        Direct Contact
                      </h3>
                      <p className="text-white font-bold mb-1">
                        Email: info@wheels2deals.com
                      </p>
                      <p className="text-white/60 text-sm">
                        Phone: +971 56 149 8485
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Information We Collect */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    3
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Information We Collect
                  </h2>
                </div>
                <div className="space-y-10 font-[family-name:var(--font-body)] text-lg text-white/70">
                  <div>
                    <h3 className="text-white font-bold mb-4">
                      3.1 Information You Provide Directly
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {[
                        "Identity information (Name, Emirates ID, Passport, Licence).",
                        "Contact information (Phone, Email, Residential Address).",
                        "Vehicle information (VIN, Registration, Service History).",
                        "Financial information (Bank details for finance applications).",
                        "Transaction history and communications.",
                        "Account credentials and profile preferences.",
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[#C9A84C] font-bold mb-3 italic">
                        3.2 Automatic Collection
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Device technical info (IP address, browser type), usage
                        metrics (pages visited, links clicked), and precise
                        location data where consented.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h3 className="text-[#C9A84C] font-bold mb-3 italic">
                        3.3 Third-Party Sources
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Service partners (RTA, insurers), public databases for
                        vehicle history, and social media platform interactions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Lawful Bases */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    4
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Lawful Bases for Processing
                  </h2>
                </div>
                <p className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed text-lg mb-6">
                  Under the UAE PDPL, we process your personal data on one or
                  more of the following bases:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 font-[family-name:var(--font-body)] text-white/60">
                  {[
                    "Your explicit consent.",
                    "Performance of a legal contract.",
                    "Compliance with regulatory obligations.",
                    "Protection of vital interests.",
                    "Legitimate business interests.",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. How We Use Your Information */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    5
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    How We Use Your Information
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed text-lg space-y-4">
                  <p>
                    We use your data to facilitate vehicle transactions, verify
                    identity for AML/fraud prevention, coordinate with RTA and
                    insurers, and personalize your experience. We may also send
                    marketing communications where you have consented.
                  </p>
                </div>
              </div>

              {/* 6. Sharing Information */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    6
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    How We Share Your Information
                  </h2>
                </div>
                <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 font-[family-name:var(--font-body)]">
                  <p className="text-[#C9A84C] font-bold mb-6 uppercase tracking-widest text-sm">
                    We do not sell your personal data.
                  </p>
                  <div className="grid md:grid-cols-2 gap-10 text-white/70">
                    <div className="space-y-4">
                      <h3 className="text-white font-bold">Service Partners</h3>
                      <p className="text-sm leading-relaxed">
                        RTA-approved centres, licensed insurers, banks, and
                        payment processors necessary to fulfil your requests.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-bold">
                        Legal Authorities
                      </h3>
                      <p className="text-sm leading-relaxed">
                        Government regulators, courts, or law-enforcement
                        agencies where required by UAE law.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8. Data Retention */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    8
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Data Retention
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed text-lg space-y-4">
                  <p>
                    We retain records as necessary for legal and regulatory
                    compliance:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-white/5 text-center">
                      <p className="text-[#C9A84C] font-bold text-2xl mb-1">
                        5Y
                      </p>
                      <p className="text-xs uppercase tracking-widest">
                        Transaction Records
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 text-center">
                      <p className="text-[#C9A84C] font-bold text-2xl mb-1">
                        2Y
                      </p>
                      <p className="text-xs uppercase tracking-widest">
                        Non-Client Enquiries
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 text-center">
                      <p className="text-[#C9A84C] font-bold text-2xl mb-1">
                        ∞
                      </p>
                      <p className="text-xs uppercase tracking-widest">
                        Until Unsubscribe
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 11. Your Rights */}
              <div className="p-8 md:p-12 rounded-[32px] bg-[#C9A84C] text-[#2A3510] reveal-on-scroll">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-6">
                  11. Your Rights under UAE Law
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 font-[family-name:var(--font-body)] font-medium">
                  {[
                    "Right to access your data",
                    "Right to rectification",
                    "Right to erasure (deletion)",
                    "Right to object to processing",
                    "Right to restrict processing",
                    "Right to data portability",
                    "Right to withdraw consent",
                  ].map((right, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2A3510]" />
                      <span>{right}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-10 pt-10 border-t border-[#2A3510]/10 text-sm font-bold">
                  To exercise these rights, email info@wheels2deals.com.
                </p>
              </div>

              {/* Final Sections */}
              <div className="reveal-on-scroll space-y-12 font-[family-name:var(--font-body)] text-white/70 text-lg">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    13. Children's Privacy
                  </h3>
                  <p className="leading-relaxed">
                    Our Services are not directed at children under the age of
                    18, and we do not knowingly collect personal data from
                    minors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    16. Changes to This Policy
                  </h3>
                  <p className="leading-relaxed">
                    We may update this Privacy Policy to reflect changes in
                    practices or legal requirements. Continued use after changes
                    constitutes acceptance.
                  </p>
                </div>
              </div>

              {/* Contact Us */}
              <div className="reveal-on-scroll text-center pt-8 border-t border-white/10">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white mb-8">
                  18. Contact Us
                </h2>
                <div className="grid sm:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[#C9A84C] text-sm font-bold uppercase tracking-widest mb-2">
                      Office
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      SIT Tower, Dubai Silicon Oasis,
                      <br />
                      Dubai, UAE
                    </p>
                  </div>
                  <div>
                    <p className="text-[#C9A84C] text-sm font-bold uppercase tracking-widest mb-2">
                      Data Protection
                    </p>
                    <p className="text-white/70 text-sm">
                      info@wheels2deals.com
                    </p>
                  </div>
                  <div>
                    <p className="text-[#C9A84C] text-sm font-bold uppercase tracking-widest mb-2">
                      Phone
                    </p>
                    <p className="text-white/70 text-sm">+971 56 149 8485</p>
                  </div>
                </div>
                <p className="mt-16 font-[family-name:var(--font-body)] text-white/50 text-sm">
                  By using the Wheels2Deals Website or Services, you acknowledge
                  that you have read and understood this Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Gap matching Footer Layout */}
      <div className="h-24 md:h-15 bg-[var(--color-page-bg)]" />

      <FooterSection />
    </main>
  );
}
