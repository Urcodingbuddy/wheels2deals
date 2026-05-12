import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";

export default function TermsPage() {
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
              Legal Documentation
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Terms and Conditions
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
                    Welcome to Wheels2Deals (&quot;Wheels2Deals&quot;,
                    &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These
                    Terms and Conditions (&quot;Terms&quot;) govern your access
                    to and use of the website{" "}
                    <a
                      href="https://www.wheels2deals.com"
                      className="text-[#C9A84C] hover:underline"
                    >
                      https://www.wheels2deals.com
                    </a>{" "}
                    (the &quot;Website&quot;) and the services we provide
                    (collectively, the &quot;Services&quot;).
                  </p>
                  <p>
                    By accessing, browsing, registering on, or using the Website
                    or Services, you (&quot;User&quot;, &quot;you&quot;, or
                    &quot;your&quot;) agree to be legally bound by these Terms.
                    If you do not agree to these Terms, you must not use the
                    Website or Services.
                  </p>
                  <p>
                    These Terms constitute a legally binding agreement between
                    you and Wheels2Deals and are governed by the laws of the
                    United Arab Emirates (&quot;UAE&quot;) and the Emirate of
                    Dubai.
                  </p>
                </div>
              </div>

              {/* 2. About Wheels2Deals */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    2
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    About Wheels2Deals
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed space-y-6 text-lg">
                  <p>
                    Wheels2Deals is a UAE-based automotive brokerage platform
                    that connects buyers and sellers of vehicles. Our Services
                    include, but are not limited to:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Car buying support and assistance with verified listings.",
                      "Car selling support, including vehicle valuation and marketing.",
                      "Vehicle inspection, passing, and ownership transfer support.",
                      "Referral and facilitation of car insurance services through licensed third-party insurers.",
                      "Referral and facilitation of car finance and loan services through licensed third-party financial institutions.",
                      "Car detailing and protection services.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-4 border-t border-white/5 italic">
                    Our registered office is located at SIT Tower, Dubai Silicon
                    Oasis, Dubai, United Arab Emirates.
                  </p>
                </div>
              </div>

              {/* 3. Eligibility */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    3
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Eligibility
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed space-y-4 text-lg">
                  <p>To use the Website and Services, you must:</p>
                  <ul className="space-y-3">
                    {[
                      "Be at least 21 years of age and legally permitted to enter into binding contracts under UAE law.",
                      "Hold valid identification documents (such as Emirates ID, passport, or UAE residency visa) where required.",
                      "Provide accurate, complete, and up-to-date information when interacting with us.",
                      "Not be prohibited from using our Services under any applicable law.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4">
                    By using the Services, you represent and warrant that you
                    meet these eligibility requirements.
                  </p>
                </div>
              </div>

              {/* 4. Nature of Our Services */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    4
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Nature of Our Services
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-8 font-[family-name:var(--font-body)]">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-[#C9A84C] font-bold mb-3">
                      4.1 Brokerage Role
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      Wheels2Deals acts as an intermediary and facilitator
                      between buyers and sellers of vehicles. We are not a
                      manufacturer, dealer, or direct seller of vehicles unless
                      expressly stated for a specific listing.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-[#C9A84C] font-bold mb-3">
                      4.2 Third-Party Services
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      Insurance, financing, vehicle inspection, RTA-related
                      services, and certain detailing services may be provided
                      by independent third-party service providers. Your
                      dealings with these third parties are solely between you
                      and them.
                    </p>
                  </div>
                  <div className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-[#C9A84C]/30">
                    <h3 className="text-[#C9A84C] font-bold mb-3 uppercase tracking-wider text-sm">
                      4.3 No Warranty on Vehicles
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      Unless explicitly provided in a separate written
                      agreement, Wheels2Deals does not provide any express or
                      implied warranty regarding the condition, mileage,
                      history, performance, or fitness for purpose of any
                      vehicle. Buyers are strongly encouraged to conduct
                      independent inspections before purchase.
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. User Obligations */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    5
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    User Obligations
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed space-y-4 text-lg">
                  <p>You agree that you will:</p>
                  <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
                    {[
                      "Use the Website and Services only for lawful purposes.",
                      "Provide truthful and accurate information at all times.",
                      "Not list vehicles that are stolen or have tampered odometers.",
                      "Not impersonate any person or misrepresent your affiliation.",
                      "Not transmit viruses, malware, or harmful code.",
                      "Not engage in scraping or data mining of the Website.",
                      "Not post content that is unlawful, obscene, or threatening.",
                      "Comply with all applicable UAE traffic and AML laws.",
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-2.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6. Vehicle Listings */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    6
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Vehicle Listings
                  </h2>
                </div>
                <div className="space-y-6 font-[family-name:var(--font-body)] text-lg text-white/70">
                  <p>
                    <strong className="text-white">
                      6.1 Seller Responsibilities:
                    </strong>{" "}
                    Sellers are solely responsible for the accuracy of all
                    information provided about their vehicle. Sellers warrant
                    that they have the legal right to sell the vehicle.
                  </p>
                  <p>
                    <strong className="text-white">
                      6.2 Buyer Responsibilities:
                    </strong>{" "}
                    Buyers are responsible for verifying the suitability of any
                    vehicle. We strongly recommend independent inspections and
                    review of all available documentation.
                  </p>
                  <p>
                    <strong className="text-white">
                      6.3 Right to Remove Listings:
                    </strong>{" "}
                    Wheels2Deals reserves the right to refuse, suspend, or
                    remove any listing at its sole discretion.
                  </p>
                </div>
              </div>

              {/* 7. Fees & Payments */}
              <div className="reveal-on-scroll">
                <div className="flex items-center gap-4 mb-6">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                    7
                  </span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                    Fees, Commissions, and Payments
                  </h2>
                </div>
                <div className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed text-lg space-y-4">
                  <p>
                    All payments shall be made in UAE Dirhams (AED) unless
                    otherwise agreed. You are responsible for any applicable
                    Value Added Tax (VAT) at the prevailing UAE rate, as well as
                    any other government fees or third-party service charges.
                  </p>
                  <div className="p-5 rounded-xl bg-[#C9A84C]/5 border-l-2 border-[#C9A84C]">
                    <p className="text-sm italic">
                      Unless explicitly stated in writing, all fees paid to
                      Wheels2Deals are non-refundable once the relevant service
                      has commenced.
                    </p>
                  </div>
                </div>
              </div>

              {/* 8-12. Intellectual Property, Disclaimers, Liability */}
              {[
                {
                  id: 8,
                  title: "Intellectual Property",
                  content:
                    "All content on the Website, including text, graphics, logos, and arrangement thereof, is the property of Wheels2Deals or its licensors and is protected by UAE and international intellectual property laws.",
                },
                {
                  id: 9,
                  title: "User-Generated Content",
                  content:
                    "By submitting content to the Website, you grant Wheels2Deals a worldwide, royalty-free license to use, reproduce, and distribute the content in connection with the promotion of the Services.",
                },
                {
                  id: 10,
                  title: "Disclaimers",
                  content:
                    'The Website and Services are provided on an "as is" basis. We do not warrant that the Website will be uninterrupted or error-free. Vehicle details are subject to change without notice.',
                },
                {
                  id: 11,
                  title: "Limitation of Liability",
                  content:
                    "In no event shall Wheels2Deals be liable for any indirect, incidental, or consequential damages. Our total aggregate liability shall not exceed the fees paid by you in the preceding six months or AED 1,000.",
                },
                {
                  id: 12,
                  title: "Indemnification",
                  content:
                    "You agree to indemnify and hold harmless Wheels2Deals from any claims arising out of your use of the Website, breach of these Terms, or violation of any third-party rights.",
                },
              ].map((section) => (
                <div key={section.id} className="reveal-on-scroll">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center font-[family-name:var(--font-display)] text-[#C9A84C] font-bold text-lg">
                      {section.id}
                    </span>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white">
                      {section.title}
                    </h2>
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-white/70 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* 13-17. Suspension, Privacy, Force Majeure */}
              <div className="reveal-on-scroll space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    13. Suspension and Termination
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    We reserve the right to suspend or terminate your access at
                    any time for any reason, including breach of these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    14. Third-Party Links
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    The Website may contain links to third-party sites. We do
                    not endorse or assume responsibility for their content or
                    services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    15. Privacy
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Your use of our Services is governed by our Privacy Policy,
                    available at{" "}
                    <a
                      href="/privacy"
                      className="text-[#C9A84C] hover:underline"
                    >
                      wheels2deals.com/privacy
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    17. Force Majeure
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    We shall not be liable for delays caused by circumstances
                    beyond our reasonable control, including acts of God, war,
                    or internet failure.
                  </p>
                </div>
              </div>

              {/* 18. Governing Law */}
              <div className="p-8 md:p-12 rounded-[32px] bg-[#C9A84C] text-[#2A3510] reveal-on-scroll">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold mb-6">
                  18. Governing Law and Dispute Resolution
                </h2>
                <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed mb-6 font-medium">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the United Arab Emirates as applicable in the
                  Emirate of Dubai.
                </p>
                <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed">
                  Any dispute arising out of or in connection with these Terms
                  shall be subject to the exclusive jurisdiction of the
                  competent courts of Dubai, UAE.
                </p>
              </div>

              {/* Contact Us */}
              <div className="reveal-on-scroll text-center pt-8 border-t border-white/10">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white mb-8">
                  20. Contact Us
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
                      Email
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
                  that you have read, understood, and agreed to these Terms and
                  Conditions.
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
