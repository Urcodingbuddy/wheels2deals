import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/LandingNav";
import { PremiumCTA } from "@/components/shared/PremiumCTA";

type Feature = {
  title: string;
  description: string;
};

type ServiceData = {
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  whyItMatters?: string;
};

const serviceContent: Record<string, ServiceData> = {
  buying: {
    title: "Car Buying Support",
    subtitle: "Make a confident, informed purchase - without the stress.",
    description:
      "Buying a car can feel overwhelming - countless listings, hidden defects, inflated prices, and mountains of paperwork. We turn that chaos into clarity. From the moment you decide on a budget to the day the keys are in your hand, our team walks beside you, making sure every step is transparent, every option is verified, and every dirham is well spent.",
    features: [
      {
        title: "Smart Vehicle Matching",
        description:
          "We identify the right vehicle based on your budget, lifestyle, and personal preferences.",
      },
      {
        title: "Verified Shortlists",
        description:
          "Only credible, pre-screened options reach you - saving you days of filtering.",
      },
      {
        title: "Market Price Evaluation",
        description:
          "Real-time market data ensures you never overpay for any vehicle.",
      },
      {
        title: "Inspection Coordination",
        description:
          "We arrange professional inspections to uncover hidden issues before purchase.",
      },
      {
        title: "Expert Negotiation",
        description:
          "We negotiate the best deal on your behalf - you save money without the awkwardness.",
      },
      {
        title: "Documentation & Transfer",
        description:
          "Complete support for paperwork, ownership transfer, and seller coordination.",
      },
    ],
    whyItMatters:
      "A bad car deal can haunt you for years - financially and mechanically. With our buying support, you save time, sidestep costly surprises, and gain a trusted advocate who works only for your best interest, not the seller's.",
  },
  selling: {
    title: "Car Selling Support",
    subtitle:
      "Sell smarter, faster, and for the price your car truly deserves.",
    description:
      "Selling a car privately can be exhausting - endless calls, lowball offers, no-shows, and the constant worry of payment fraud. We take that burden off your shoulders. From the first valuation to the final handover, our team manages every detail, helping you secure the best price with minimal effort and zero stress.",
    features: [
      {
        title: "Accurate Valuation",
        description:
          "Data-driven pricing ensures your car is competitive yet profitable in the market.",
      },
      {
        title: "Professional Listings",
        description:
          "Eye-catching listings with quality photography that attract serious buyers fast.",
      },
      {
        title: "Targeted Promotion",
        description:
          "We promote your vehicle to the right audience across the most effective channels.",
      },
      {
        title: "Inquiry Management",
        description:
          "We screen buyers, schedule viewings, and filter out time-wasters on your behalf.",
      },
      {
        title: "Skilled Negotiation",
        description:
          "Our experts secure the most favourable deal so you walk away genuinely satisfied.",
      },
      {
        title: "Safe Handover",
        description:
          "Secure documentation, transfer, and payment process from start to finish.",
      },
    ],
    whyItMatters:
      "Most private sellers leave money on the table - either by underpricing, accepting weak offers, or rushing the process out of fatigue. We turn selling into a streamlined, professional experience where you stay in control and walk away with maximum value.",
  },
  "inspection-and-transfer": {
    title: "Inspection, Passing & Ownership Transfer",
    subtitle: "All your vehicle admin - handled, end-to-end.",
    description:
      "Vehicle inspections, registration renewals, passing tests, and ownership transfers can swallow your weekend and your patience. We connect you with certified inspection partners and manage every regulatory step on your behalf - from scheduling and documentation to passing and final transfer - so your car stays road-legal and your time stays yours.",
    features: [
      {
        title: "Certified Inspectors",
        description:
          "Hand-picked partners chosen for credibility, expertise, and unbiased reporting.",
      },
      {
        title: "Appointment Coordination",
        description:
          "We compare options, book slots, and ensure you get the best inspection value.",
      },
      {
        title: "Car Passing Support",
        description:
          "We prepare your car for testing and resolve any issues that arise during the process.",
      },
      {
        title: "Ownership Transfer",
        description:
          "Smooth, legally compliant handover between buyer and seller - every time.",
      },
      {
        title: "Timely Renewals",
        description:
          "Never miss a registration deadline - we handle renewals before penalties hit.",
      },
      {
        title: "Document Preparation",
        description:
          "All paperwork prepared accurately, the first time, so nothing gets bounced back.",
      },
    ],
    whyItMatters:
      "Skipped inspections, lapsed registrations, and improperly transferred ownership create real problems - fines, voided insurance, even legal disputes. We make sure none of that touches you. One call, one team, every box ticked.",
  },
  insurance: {
    title: "Car Insurance Services",
    subtitle: "The right coverage. The best rate. Zero confusion.",
    description:
      "Insurance is one of those things you only think about when something goes wrong - and that's exactly when the wrong policy hurts most. We help you choose smarter from the start. By comparing trusted insurers and demystifying the fine print, we make sure you're paying the right price for coverage that actually protects you when it counts.",
    features: [
      {
        title: "Policy Comparison",
        description:
          "Side-by-side comparison from trusted insurers so you see real differences instantly.",
      },
      {
        title: "Best-Rate Sourcing",
        description:
          "We find competitive premiums tailored to your driving profile and vehicle.",
      },
      {
        title: "Clear Explanations",
        description:
          "Coverage, exclusions, and benefits broken down in plain language - no jargon.",
      },
      {
        title: "New Policy Setup",
        description:
          "Fast, efficient policy issuance so your car is protected without delay.",
      },
      {
        title: "Renewal Management",
        description:
          "We track expiry dates and renew on time - often at improved rates.",
      },
      {
        title: "Claims Support",
        description:
          "When something goes wrong, we guide your claim from filing through settlement.",
      },
    ],
    whyItMatters:
      "A cheap policy with the wrong coverage costs more than a smart one. We make sure you understand exactly what you're paying for, and that when an accident happens, your insurance actually shows up - fully and on time.",
  },
  finance: {
    title: "Car Finance & Loan Assistance",
    subtitle: "Drive away today - without compromising tomorrow.",
    description:
      "The right car loan can save you tens of thousands over its lifetime. The wrong one quietly drains your finances for years. Our team partners with reputable banks and lenders to help you compare rates, understand the real cost of borrowing, and choose a financing plan that fits your life - not just your monthly affordability.",
    features: [
      {
        title: "Trusted Lender Network",
        description:
          "Established partnerships with leading banks and reputable financial institutions.",
      },
      {
        title: "Competitive Rates",
        description:
          "Access exclusive rates and offers that aren't always available to walk-in customers.",
      },
      {
        title: "Flexible Plans",
        description:
          "Repayment terms shaped around your income, lifestyle, and long-term goals.",
      },
      {
        title: "Eligibility Assessment",
        description:
          "Honest, upfront feedback on what you qualify for - no guesswork or wasted applications.",
      },
      {
        title: "Documentation Support",
        description:
          "We prepare and review every document so approvals move quickly and cleanly.",
      },
      {
        title: "Fast Disbursement",
        description:
          "Streamlined approval-to-disbursement so you drive away without unnecessary delays.",
      },
    ],
    whyItMatters:
      "Most buyers accept the first loan they're offered - and lose thousands without realising it. We help you see beyond the headline rate to find financing that's genuinely affordable, transparent, and aligned with your financial future.",
  },
  detailing: {
    title: "Car Detailing & Protection",
    subtitle: "Showroom shine. Long-lasting protection. Real value retention.",
    description:
      "A well-detailed car isn't just beautiful - it's better protected, holds resale value, and feels brand new every time you step inside. Our detailing services go far beyond a standard wash. From deep interior treatments to ceramic coatings that defend your paint for years, we restore, refine, and shield your vehicle with premium products and meticulous craftsmanship.",
    features: [
      {
        title: "Car Polishing",
        description:
          "Multi-stage polish removes swirl marks, oxidation, and light scratches for deep gloss.",
      },
      {
        title: "Ceramic Coating",
        description:
          "Long-lasting hydrophobic protection that defends paint from UV, dirt, and chemicals.",
      },
      {
        title: "Paint Protection Film",
        description:
          "Invisible PPF shield against rock chips, scratches, and road debris damage.",
      },
      {
        title: "Interior Detailing",
        description:
          "Deep cleaning, leather conditioning, and fabric treatment for a like-new cabin.",
      },
      {
        title: "Headlight Restoration",
        description:
          "Restores clarity to faded, yellowed lenses for safer night driving and a fresh look.",
      },
      {
        title: "Engine Bay Detailing",
        description:
          "Professional cleaning and dressing - protects components and impresses every buyer.",
      },
    ],
    whyItMatters:
      "Detailing isn't a luxury - it's an investment. Ceramic coatings can extend paint life by years, polished interiors fetch higher resale values, and a well-maintained car simply feels better to own. We treat every vehicle as if it were our own.",
  },
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServicePage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const content = serviceContent[slug];

  if (!content) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-[#2A3510] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('/services_bg.jpg')` }}
      />
      {/* Fixed Overlay for Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2A3510]/50 via-[#2A3510]/70 to-[#2A3510]/90" />

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col items-start">
          <Link
            href="/#services"
            className="mb-12 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-[family-name:var(--font-body)] text-[13px] font-semibold transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <span className="mb-4 font-[family-name:var(--font-body)] text-[14px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
            W2D Services
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,6vw,80px)] font-bold text-white leading-[1.05] tracking-tight mb-8">
            {content.title}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[20px] md:text-[24px] text-white/80 max-w-3xl leading-relaxed">
            {content.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-10 pb-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          {/* Main Description */}
          <div className="mb-20">
            <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/70 leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Features List */}
          <div className="mb-24">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white mb-12">
              What's Included
            </h2>
            <div className="grid sm:grid-cols-2 gap-y-12 gap-x-12">
              {content.features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-start">
                  <div className="flex items-center gap-4 mb-3">
                    <CheckCircle2 className="w-6 h-6 text-[#C9A84C] flex-shrink-0" />
                    <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-white leading-tight">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-[family-name:var(--font-body)] text-[16px] text-white/60 leading-relaxed pl-10">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          {content.whyItMatters && (
            <div className="mb-24 border-l-4 border-[#C9A84C] pl-8 md:pl-12 py-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white mb-6">
                Why It Matters
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[22px] text-[#C9A84C] leading-relaxed italic">
                "{content.whyItMatters}"
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="pt-16 border-t border-white/10">
            <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to get started?
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/60 mb-10 max-w-2xl">
              Contact our experts today on WhatsApp for immediate assistance
              with {content.title.toLowerCase()}.
            </p>
            <PremiumCTA
              href={`https://wa.me/971501568003?text=${encodeURIComponent(`Hi Wheels2Deals, I'm interested in ${content.title}. Could you help me with more information?`)}`}
              text="Contact via WhatsApp"
              variant="primary"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
