"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { PremiumCTA } from "@/components/shared/PremiumCTA";
import {
  Car,
  Banknote,
  BadgeCheck,
  Wrench,
  ShieldCheck,
  ClipboardCheck,
  ArrowRight,
  Plus,
  CheckCircle2,
} from "lucide-react";

const SERVICES = [
  {
    id: "buy",
    title: "Buy",
    fullName: "Buying a Car",
    icon: Car,
    summary:
      "From discovery to drive-off, we've re-imagined the purchase journey to be as smooth as the cars we list.",
    steps: [
      {
        t: "Browse verified listings",
        d: "Filter by brand, body type, fuel, transmission, and budget across the UAE.",
      },
      {
        t: "Shortlist & connect",
        d: "Save favourites and reach out to verified sellers directly through the platform.",
      },
      {
        t: "Book an inspection",
        d: "Request a Wheels2Deals pre-purchase inspection before committing.",
      },
      {
        t: "Finalise the deal",
        d: "We coordinate payment, paperwork, and ownership transfer end-to-end.",
      },
      {
        t: "Drive home",
        d: "Collect your keys with full RTA registration and insurance ready.",
      },
    ],
  },
  {
    id: "sell",
    title: "Sell",
    fullName: "Selling a Car",
    icon: Banknote,
    summary:
      "Your car deserves a premium exit. We maximize your return while minimizing your effort.",
    steps: [
      {
        t: "Submit your details",
        d: "Share your car's make, model, year, mileage, and condition in under 2 minutes.",
      },
      {
        t: "Get an instant valuation",
        d: "Our pricing engine benchmarks your car against live UAE market data.",
      },
      {
        t: "Free vehicle inspection",
        d: "Book a slot at a Wheels2Deals partner centre or request home pickup.",
      },
      {
        t: "Receive a firm offer",
        d: "Get a guaranteed buy-back price valid for 7 days, no obligation.",
      },
      {
        t: "Get paid same-day",
        d: "On acceptance, funds are transferred directly to your account and we handle the RTA transfer.",
      },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    fullName: "Finance & Loans",
    icon: BadgeCheck,
    summary:
      "Smart financing tailored to your lifestyle. We pull the best rates from the UAE's leading banks.",
    steps: [
      {
        t: "Tell us about your car",
        d: "Share the listing or vehicle details you're financing.",
      },
      {
        t: "Check your eligibility",
        d: "A quick form covering income, employment, and residency status.",
      },
      {
        t: "Compare offers",
        d: "We pull rates from leading UAE banks - Emirates NBD, ADCB, FAB, Mashreq, and more.",
      },
      {
        t: "Submit documents",
        d: "Upload Emirates ID, salary certificate, and bank statements securely online.",
      },
      {
        t: "Get approval",
        d: "Most approvals come through within 24–48 hours, with funds disbursed straight to the seller.",
      },
    ],
  },
  {
    id: "rta",
    title: "RTA",
    fullName: "RTA Inspection",
    icon: Wrench,
    summary:
      "Comprehensive RTA-approved testing that ensures your car is road-legal and resale-ready.",
    steps: [
      {
        t: "Book a slot",
        d: "Pick a date, time, and location that works for you (Dubai, Sharjah, Abu Dhabi, and more).",
      },
      {
        t: "Bring your car",
        d: "Our partner centres run the full RTA-approved test; mobile inspection is available.",
      },
      {
        t: "200-point check",
        d: "Engine, transmission, brakes, electronics, and chassis assessed by certified technicians.",
      },
      {
        t: "Digital report",
        d: "Photos, video walkthrough, and pass/fail results emailed within hours.",
      },
      {
        t: "Get certified",
        d: "Use the report for resale, insurance renewal, or peace of mind before purchase.",
      },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    fullName: "Car Insurance",
    icon: ShieldCheck,
    summary:
      "Coverage that actually protects. Compare, customize, and activate your policy in minutes.",
    steps: [
      {
        t: "Enter your car details",
        d: "Make, model, year, and intended cover type (Comprehensive or Third-Party).",
      },
      {
        t: "Compare quotes",
        d: "Live pricing from top UAE insurers including AXA, Oman Insurance, Sukoon, and Orient.",
      },
      {
        t: "Customise your cover",
        d: "Add extras like off-road, GCC cover, agency repair, or roadside assistance.",
      },
      {
        t: "Pay & activate",
        d: "Secure card payment with instant policy issuance.",
      },
      {
        t: "Get your e-policy",
        d: "Documents delivered to your inbox, valid immediately for RTA registration.",
      },
    ],
  },
  {
    id: "transfer",
    title: "Transfer",
    fullName: "Registration & Transfer",
    icon: ClipboardCheck,
    summary:
      "End-to-end administrative support. We clear the fines, the loans, and the hurdles.",
    steps: [
      {
        t: "Share ownership details",
        d: "Buyer and seller information, current Mulkiya, and Emirates IDs.",
      },
      {
        t: "Clear prerequisites",
        d: "Salik balance, traffic fines, loan clearance letters, and payments handled for you.",
      },
      {
        t: "Schedule transfer",
        d: "We book your RTA appointment or process it through an approved typing centre.",
      },
      {
        t: "Documentation",
        d: "New Mulkiya issued, plates updated, and insurance linked.",
      },
      {
        t: "Success",
        d: "Digital and physical Mulkiya delivered, usually within 1 working day.",
      },
    ],
  },
];

export default function HowItWorksPage() {
  const [active, setActive] = useState("buy");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const journeyRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeData = SERVICES.find((s) => s.id === active)!;

  useEffect(() => {
    const handleScroll = () => {
      if (!journeyRef.current) return;

      const container = journeyRef.current;
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress for the journey section
      const totalHeight = rect.height;
      const startPos = rect.top;
      const centerLine = viewportHeight / 2;

      const progress = Math.max(
        0,
        Math.min(1, (centerLine - startPos) / totalHeight),
      );
      setScrollProgress(progress);

      // Track which step is currently active
      let currentActive = 0;
      stepRefs.current.forEach((ref, idx) => {
        if (ref) {
          const stepRect = ref.getBoundingClientRect();
          if (stepRect.top < centerLine + 100) {
            currentActive = idx;
          }
        }
      });
      setActiveStepIndex(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  return (
    <main className="relative min-h-screen bg-[var(--color-page-bg)] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('/services_bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-[#2A3510]/60 pointer-events-none" />

      {/* Editorial Hero */}
      <section className="pt-32 md:pt-48 pb-5 md:pb-24 px-6 border-b border-white/5 relative overflow-hidden bg-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_70%)] pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <span className="inline-block mb-4 md:mb-6 font-[family-name:var(--font-body)] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
            One Hub. Every Move.
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,7.5vw,110px)] font-bold text-white leading-[0.95] md:leading-[0.9] tracking-tighter mb-12 md:mb-16">
            How it <br className="hidden md:block" />
            <span className="italic font-light text-[#C9A84C]">works.</span>
          </h1>

          <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 items-center">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`relative font-[family-name:var(--font-display)] text-[16px] md:text-[22px] font-bold transition-all duration-300 pb-2 ${
                  active === s.id
                    ? "text-[#C9A84C]"
                    : "text-white/20 hover:text-white/50"
                }`}
              >
                {s.title}
                {active === s.id && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] md:h-[3px] bg-[#C9A84C] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Journey Section */}
      <section className="relative z-10  md:pt-24 md:pb-24 px-6 min-h-[70vh] md:min-h-[80vh] bg-transparent rounded-b-[40px] md:rounded-b-[60px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-12 md:gap-20 items-start">
            <div className="relative z-10 lg:sticky lg:top-40">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C9A84C] mb-6 md:mb-10">
                <activeData.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 leading-tight">
                {activeData.fullName}
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/70 leading-relaxed mb-8 md:mb-10">
                {activeData.summary}
              </p>
              <PremiumCTA
                href={`/${active}`}
                text="Get started now"
                variant="outline"
                className="!min-w-[180px] !h-[60px]"
              />
            </div>

            <div
              ref={journeyRef}
              className="relative space-y-12 md:space-y-16 mt-12 lg:mt-0"
            >
              {/* Base Line */}
              <div className="absolute left-6 md:left-8 top-10 md:top-12 bottom-10 md:bottom-12 w-[1px] bg-white/10" />

              {/* Animated Progress Line */}
              <div
                className="absolute left-6 md:left-8 top-10 md:top-12 w-[1px] bg-[#C9A84C] transition-all duration-300 ease-out origin-top z-[1]"
                style={{ height: `calc(${scrollProgress * 100}% - 20px)` }}
              />

              {activeData.steps.map((step, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  className="relative pl-16 md:pl-24 group"
                >
                  {/* The Ball (Animated Color) */}
                  <div
                    className={`absolute left-0 top-1 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 border-[#2A3510] transition-all duration-700 z-10 ${
                      idx <= activeStepIndex
                        ? "bg-[#C9A84C] text-[#2A3510]"
                        : "bg-white/5 text-white/20 group-hover:text-white group-hover:bg-white/10"
                    }`}
                  >
                    <span className="font-[family-name:var(--font-display)] font-bold text-base md:text-xl">
                      0{idx + 1}
                    </span>
                  </div>

                  <div
                    className={`transition-all duration-700 ${idx <= activeStepIndex ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}
                  >
                    <h3
                      className={`font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight uppercase transition-colors duration-500 ${
                        idx <= activeStepIndex ? "text-white" : "text-white/40"
                      }`}
                    >
                      {step.t}
                    </h3>
                    <p className="font-[family-name:var(--font-body)] text-[16px] md:text-lg text-white/50 leading-relaxed max-w-xl">
                      {step.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24 md:py-48 px-6 bg-[#2A3510] text-white rounded-[40px] md:rounded-[60px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="max-w-[1440px] mx-auto text-center relative z-10">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,6vw,90px)] font-bold leading-[1.1] md:leading-[1.05] tracking-tight mb-8 md:mb-12">
            One platform.
            <br />
            Six services.
            <br />
            <span className="italic font-light text-[#C9A84C]">
              Zero hassle.
            </span>
          </h2>
          <p className="text-white/60 text-[18px] md:text-[24px] leading-relaxed max-w-3xl mx-auto font-[family-name:var(--font-body)]">
            Whether you're buying your first car or upgrading your fifth, we
            cover every step - verified listings, transparent pricing, certified
            inspections, competitive finance, comprehensive insurance, and
            seamless RTA transfers.
          </p>
        </div>
      </section>

      {/* Gap matching Footer Layout */}
      <div className="h-24 md:h-15 bg-[var(--color-page-bg)]" />

      <FooterSection />
    </main>
  );
}
