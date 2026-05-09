"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  Star,
  ShieldCheck,
  CarFront,
  Banknote,
  Shield,
  Phone,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";

import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";

const BRANDS = [
  { name: "Toyota", logo: "/brands/toyota.png" },
  { name: "BMW", logo: "/brands/bmw.png" },
  { name: "Mercedes", logo: "/brands/mercedes-benz.png" },
  { name: "Audi", logo: "/brands/audi.png" },
  { name: "Nissan", logo: "/brands/nissan.png" },
  { name: "Porsche", logo: "/brands/porsche.png" },
  { name: "Lexus", logo: "/brands/lexus.png" },
  { name: "Land Rover", logo: "/brands/land-rover.png" },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Tell us about your car",
    desc: "Share basic details and we'll respond within an hour with an honest market valuation backed by 50,000+ historical transactions.",
    time: "≈ 2 MINUTES",
  },
  {
    num: "02",
    title: "Home inspection",
    desc: "Our certified inspector visits your home or office for a 200-point inspection. We document everything to maximize buyer confidence.",
    time: "SAME DAY",
  },
  {
    num: "03",
    title: "We find your buyer",
    desc: "Verified private buyers and licensed dealers compete for your car. We negotiate on your behalf to secure the strongest offer.",
    time: "3 - 14 DAYS",
  },
  {
    num: "04",
    title: "Handover & payment",
    desc: "We manage RTA transfer, loan settlement, and secure payment via escrow. You get paid. Your buyer drives away. Done.",
    time: "UNDER 60 MIN",
  },
];

const FAQS = [
  {
    q: "How long does it take to sell my car?",
    a: "If you're priced at market and open to dealer buyers, your car can be sold the same day. If you want maximum value through private buyers, expect 7-14 days on average. Our broker keeps you in the loop daily - you always know where you stand.",
  },
  {
    q: "What does Wheels2Deals charge?",
    a: "Our brokerage fee starts from AED 999 plus a small admin fee from AED 99. Most sellers build the commission into their asking price, which means it effectively costs you nothing - and you still walk away with thousands more than a buying-company offer.",
  },
  {
    q: "Do you handle the RTA transfer and paperwork?",
    a: "Yes - completely. RTA ownership transfer, loan settlement with your bank, plate handover, Salik clearance, insurance cancellation. We do the running around. You sign at home or our Business Bay office and walk away with the funds.",
  },
  {
    q: "Can I sell a car that's still under bank finance?",
    a: "Absolutely. We work with every major UAE bank. Our team coordinates the loan settlement, secures the buyer's payment, and ensures the title transfers cleanly.",
  },
  {
    q: "How do you decide my car's price?",
    a: "You decide. We give you an honest valuation range based on real recent sales in the UAE market. You set the price, we market accordingly. You stay in control.",
  },
  {
    q: "Is the inspection really free?",
    a: "Yes. The home or office inspection is completely free, even if you don't end up selling with us. There's no obligation and no hidden charge.",
  },
];

export default function HowItWorksPage() {
  const [valStep, setValStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    if (valStep < 2) setValStep(2);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setYearDropdownOpen(false);
    if (valStep < 3) setValStep(3);
  };

  const handleFormChange = () => {
    if (valStep < 3) setValStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValStep(4);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden rounded-b-[40px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/services_bg.jpg')` }}
        />

        {/* Overlays for dark, premium look */}
        <div className="absolute inset-0 bg-[#2A3510]/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#2A3510]" />

        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.25),transparent_70%)] pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          {/* Hero Text */}
          <div className="flex flex-col items-start">
            <span className="mb-6 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#C9A84C]" />
              Sell with Wheels2Deals
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(44px,6vw,84px)] font-bold text-white leading-[1.05] tracking-tight mb-8">
              Sell smarter.
              <br />
              <span className="italic font-light text-[#C9A84C]">
                Sell for more.
              </span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/70 max-w-lg leading-relaxed mb-12">
              A premium UAE brokerage built for sellers who refuse to settle. We
              negotiate with verified buyers, handle every signature, and
              deliver the highest possible price - without the noise.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-16 pt-8 border-t border-white/10 w-full max-w-lg">
              <div>
                <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-white block mb-1">
                  AED 10M+
                </span>
                <span className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-wider text-white/50">
                  Cars Sold
                </span>
              </div>
              <div>
                <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-white block mb-1">
                  1000+
                </span>
                <span className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-wider text-white/50">
                  Happy Sellers
                </span>
              </div>
              <div>
                <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-white block mb-1 flex items-center gap-1">
                  5.0 <Star className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                </span>
                <span className="font-[family-name:var(--font-body)] text-[12px] uppercase tracking-wider text-white/50">
                  Avg. Rating
                </span>
              </div>
            </div>
          </div>

          {/* Valuation Form Card */}
          <div className="bg-white rounded-[24px] p-7 shadow-2xl relative max-w-[460px] w-full mx-auto lg:mx-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-[#2A3510]">
                Free instant valuation
              </h3>
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#2A3510]/50 font-medium">
                STEP 0{valStep} / 04
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#F1F3E1] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-[#C9A84C] transition-all duration-500 ease-out"
                style={{ width: `${(valStep / 4) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60 mb-3">
                  Choose your make
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand.name}
                      type="button"
                      onClick={() => handleBrandClick(brand.name)}
                      className={`py-2 px-1 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
                        selectedBrand === brand.name
                          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/5 text-[#C9A84C] shadow-sm ring-2 ring-[#C9A84C]/20"
                          : "border border-[#2A3510]/10 text-[#2A3510]/70 hover:border-[#2A3510]/30 hover:bg-[#F1F3E1]"
                      }`}
                    >
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className={`h-6 w-auto object-contain transition-all duration-300 ${
                            selectedBrand === brand.name
                              ? "opacity-100 drop-shadow-sm scale-110"
                              : "opacity-80 hover:opacity-100"
                          }`}
                        />
                      ) : (
                        <span className="h-6 flex items-center justify-center text-lg font-light text-[#2A3510]/40">
                          ...
                        </span>
                      )}
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {brand.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60 mb-2">
                    Year
                  </label>
                  <button
                    type="button"
                    onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                    className="w-full flex items-center justify-between bg-[#F1F3E1] border-2 border-transparent rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:border-[#C9A84C]/50 transition-all"
                  >
                    <span
                      className={
                        selectedYear ? "text-[#2A3510]" : "text-[#2A3510]/50"
                      }
                    >
                      {selectedYear || "Select"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 text-[#2A3510]/50 ${yearDropdownOpen ? "rotate-180 text-[#C9A84C]" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {yearDropdownOpen && (
                    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white border border-[#2A3510]/10 rounded-xl shadow-lg z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
                      {[
                        "2024",
                        "2023",
                        "2022",
                        "2021",
                        "2020",
                        "2019",
                        "Older",
                      ].map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className={`w-full text-left px-4 py-2 hover:bg-[#F1F3E1] transition-colors text-[14px] font-medium ${selectedYear === year ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60 mb-2">
                    Mileage (km)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45,000"
                    onChange={handleFormChange}
                    className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60 mb-2">
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="+971 50 000 0000"
                  onChange={() => setValStep(4)}
                  className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formSuccess}
                className={`mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-[family-name:var(--font-body)] text-[15px] font-bold transition-all duration-300 ${
                  formSuccess
                    ? "bg-green-600 text-white"
                    : "bg-[#C9A84C] hover:bg-[#b8963c] text-[#2A3510] hover:scale-[1.02] shadow-lg shadow-[#C9A84C]/20"
                }`}
              >
                {isSubmitting
                  ? "Calculating..."
                  : formSuccess
                    ? "We'll WhatsApp you ✓"
                    : "Get market value →"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#2A3510]/50 font-medium mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Free, instant & no obligation.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-16">
            <span className="mb-4 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
              The Process
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[#2A3510] tracking-tight mb-6 max-w-2xl">
              A four-step path to{" "}
              <span className="italic font-light">the right buyer.</span>
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[18px] text-[#5A5A5A] max-w-2xl leading-relaxed">
              No marketplace ads. No tire-kickers. No back-and-forth haggling.
              Our broker model is engineered for serious sellers who value their
              time as much as their car.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-[#2A3510]/10" />

            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="relative z-10 bg-white/50 border border-[#2A3510]/5 rounded-[24px] p-8 hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md group"
              >
                <div className="w-16 h-16 rounded-full bg-[#F1F3E1] border border-[#2A3510]/10 flex items-center justify-center font-[family-name:var(--font-display)] font-bold text-2xl text-[#C9A84C] mb-8 group-hover:bg-[#C9A84C] group-hover:text-white transition-colors duration-300">
                  {step.num}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2A3510] mb-4">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[15px] text-[#5A5A5A] leading-relaxed mb-6">
                  {step.desc}
                </p>
                <div className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-widest text-[#2A3510]/40 uppercase mt-auto">
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE SECTION */}
      <section className="py-24 px-6 bg-white rounded-[40px] shadow-[0_8px_32px_rgba(42,53,16,0.04)] max-w-[1440px] mx-auto my-12 border border-[#2A3510]/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center">
            <span className="mb-4 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] block">
              Compare Options
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[#2A3510] tracking-tight mb-6">
              Why brokerage <span className="italic font-light">beats</span> the
              alternatives.
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[18px] text-[#5A5A5A] max-w-3xl mx-auto leading-relaxed">
              Most car-buying companies offer 15-25% below market value.
              Marketplace listings put you at the mercy of strangers. We sit
              between - fast when you need fast, premium when you want premium.
            </p>
          </div>

          <div className="overflow-x-auto pb-8">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A3510]/10">
                  <th className="pb-6 font-[family-name:var(--font-body)] font-bold text-[#2A3510]/50 uppercase tracking-wider text-sm w-2/5">
                    Channel
                  </th>
                  <th className="pb-6 font-[family-name:var(--font-body)] font-bold text-[#2A3510]/50 uppercase tracking-wider text-sm">
                    Speed
                  </th>
                  <th className="pb-6 font-[family-name:var(--font-body)] font-bold text-[#2A3510]/50 uppercase tracking-wider text-sm">
                    Price
                  </th>
                  <th className="pb-6 font-[family-name:var(--font-body)] font-bold text-[#2A3510]/50 uppercase tracking-wider text-sm">
                    Effort
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#2A3510]/5 bg-[#C9A84C]/5">
                  <td className="py-8 pr-4">
                    <div className="font-[family-name:var(--font-display)] font-bold text-lg text-[#2A3510]">
                      Wheels2Deals -{" "}
                      <span className="text-[#C9A84C]">Private buyers</span>
                    </div>
                    <div className="text-sm text-[#5A5A5A] mt-1">
                      Maximum value, full broker service
                    </div>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-[#2A3510]/20 text-sm font-semibold text-[#2A3510]/80 bg-white">
                      Flexible · 7-14 days
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-[#C9A84C]/50 text-sm font-semibold text-[#C9A84C] bg-[#C9A84C]/10">
                      ★ Highest possible
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Zero - we manage it
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#2A3510]/5 bg-[#2A3510]/5">
                  <td className="py-8 pr-4">
                    <div className="font-[family-name:var(--font-display)] font-bold text-lg text-[#2A3510]">
                      Wheels2Deals - Dealer buyers
                    </div>
                    <div className="text-sm text-[#5A5A5A] mt-1">
                      Fast and convenient
                    </div>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Same day
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Strong market price
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Low
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-[#2A3510]/5">
                  <td className="py-8 pr-4">
                    <div className="font-[family-name:var(--font-display)] font-bold text-lg text-[#2A3510]">
                      Car-buying companies
                    </div>
                    <div className="text-sm text-[#5A5A5A] mt-1">
                      One-shot lowball offers
                    </div>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Same day
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-red-500/30 text-sm font-semibold text-red-600 bg-red-50">
                      15-25% below market
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-green-600/30 text-sm font-semibold text-green-700 bg-green-50">
                      Low
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-8 pr-4">
                    <div className="font-[family-name:var(--font-display)] font-bold text-lg text-[#2A3510]">
                      Online marketplaces
                    </div>
                    <div className="text-sm text-[#5A5A5A] mt-1">
                      Listing yourself & dealing with strangers
                    </div>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-[#2A3510]/20 text-sm font-semibold text-[#2A3510]/80">
                      Unpredictable
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-[#2A3510]/20 text-sm font-semibold text-[#2A3510]/80">
                      Variable
                    </span>
                  </td>
                  <td className="py-8 pr-4">
                    <span className="px-4 py-2 rounded-full border border-red-500/30 text-sm font-semibold text-red-600 bg-red-50">
                      High - calls, viewings, scams
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SPEED CHOICE */}
      <section className="py-24 px-6 max-w-[1440px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-lg border border-[#2A3510]/5 transition-transform hover:-translate-y-2 duration-300">
            <span className="inline-block py-2 px-4 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] font-bold text-[12px] uppercase tracking-wider mb-8 bg-[#C9A84C]/5">
              Need it gone today?
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#2A3510] mb-6 leading-tight">
              Same-day cash from licensed traders.
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[16px] text-[#5A5A5A] mb-10 leading-relaxed">
              We'll share your car with hundreds of vetted dealers ready to buy
              this afternoon. Fast decision, simple paperwork, money in your
              account today.
            </p>
            <div className="pt-8 border-t border-[#2A3510]/10 flex items-baseline gap-4">
              <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-[#C9A84C]">
                ≤ 24h
              </span>
              <span className="text-[#5A5A5A] font-medium text-sm">
                to complete sale
              </span>
            </div>
          </div>

          <div className="bg-[#2A3510] rounded-[32px] p-10 md:p-14 shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-2 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.2),transparent_70%)] pointer-events-none" />
            <span className="inline-block py-2 px-4 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] font-bold text-[12px] uppercase tracking-wider mb-8">
              Want top dollar?
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white mb-6 leading-tight">
              We market it to serious private buyers.
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[16px] text-white/70 mb-10 leading-relaxed">
              Patience pays. We professionally market your car to qualified
              private buyers and negotiate hard. Typically 12-18% more than
              dealer offers - without the headache.
            </p>
            <div className="pt-8 border-t border-white/10 flex items-baseline gap-4">
              <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-[#C9A84C]">
                +18%
              </span>
              <span className="text-white/50 font-medium text-sm">
                average uplift
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white/50 border-y border-[#2A3510]/5">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16 text-center">
            <span className="mb-4 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] block">
              Common Questions
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[#2A3510] tracking-tight">
              Anything we <span className="italic font-light">missed?</span>
            </h2>
          </div>

          <div className="flex flex-col border-t border-[#2A3510]/10">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-[#2A3510]/10 py-8">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left gap-6 group"
                >
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#2A3510] group-hover:text-[#C9A84C] transition-colors">
                    {faq.q}
                  </span>
                  <div
                    className={`flex items-center justify-center flex-shrink-0 text-[#2A3510] transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}
                  >
                    <Plus className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
                >
                  <p className="font-[family-name:var(--font-body)] text-[16px] text-[#5A5A5A] leading-relaxed max-w-3xl">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,80px)] font-bold text-[#2A3510] leading-[1.05] tracking-tight mb-8">
            Your car deserves
            <br />
            <span className="italic font-light text-[#C9A84C]">
              a better ending.
            </span>
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[20px] text-[#5A5A5A] mb-12">
            Get a free, instant valuation. Take the next step in under two
            minutes.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-3 bg-[#C9A84C] hover:bg-[#b8963c] text-[#2A3510] font-[family-name:var(--font-body)] font-bold text-[18px] px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(201,168,76,0.3)]"
          >
            Start my valuation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
