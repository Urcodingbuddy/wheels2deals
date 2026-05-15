"use client";

import { useState, useEffect, useRef } from "react";
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
  ArrowLeft,
  Plus,
} from "lucide-react";

import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { PremiumCTA } from "@/components/shared/PremiumCTA";
import { createClient } from "@/lib/client";

const BRANDS = [
  { name: "Toyota", logo: "/brands/toyota.png" },
  { name: "BMW", logo: "/brands/bmw.png" },
  { name: "Mercedes", logo: "/brands/mercedes-benz.png" },
  { name: "Audi", logo: "/brands/audi.png" },
  { name: "Nissan", logo: "/brands/nissan.png" },
  { name: "Porsche", logo: "/brands/porsche.png" },
  { name: "Lexus", logo: "/brands/lexus.png" },
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
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [customBrand, setCustomBrand] = useState("");
  const [allMakes, setAllMakes] = useState<string[]>([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [modelText, setModelText] = useState("");
  const [chassisNo, setChassisNo] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [gcc, setGcc] = useState<"GCC" | "Non-GCC" | "">("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modelSearchRef = useRef<HTMLInputElement>(null);

  // Fetch NHTSA makes once when the "More" dropdown opens
  const handleOpenMoreBrands = () => {
    setBrandDropdownOpen(true);
    if (allMakes.length > 0) return;
    setMakesLoading(true);
    fetch("/api/car-makes")
      .then((r) => r.json())
      .then(({ makes }: { makes: string[] }) => setAllMakes(makes))
      .catch(() => setAllMakes([]))
      .finally(() => setMakesLoading(false));
  };

  // Fetch models from NHTSA whenever the selected brand changes
  useEffect(() => {
    if (!selectedBrand) { setModelOptions([]); return; }
    setModelsLoading(true);
    setModelText("");
    setModelSearch("");
    fetch(`/api/car-models?make=${encodeURIComponent(selectedBrand)}`)
      .then((r) => r.json())
      .then(({ models }: { models: string[] }) => setModelOptions(models))
      .catch(() => setModelOptions([]))
      .finally(() => setModelsLoading(false));
  }, [selectedBrand]);

  const handleBrandClick = (brand: string) => {
    setSelectedBrand(brand);
    clearError("brand");
    if (valStep < 2) setValStep(2);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setYearDropdownOpen(false);
    clearError("year");
    if (valStep < 3) setValStep(3);
  };

  const handleDetailChange = () => {
    if (valStep < 3) setValStep(3);
  };

  const clearError = (field: string) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  const goToStep2 = () => {
    const e: Record<string, string> = {};
    if (!selectedBrand) e.brand = "Please select a brand.";
    if (!modelText.trim()) e.model = "Please enter a model.";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setFormStep(2);
  };

  const goToStep3 = () => {
    const e: Record<string, string> = {};
    if (!selectedYear) e.year = "Please select a year.";
    if (!kmsDriven.trim()) e.kmsDriven = "Please enter kms driven.";
    if (!gcc) e.gcc = "Please select GCC or Non-GCC.";
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setFormStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!phone.trim()) e2.phone = "Please enter your phone number.";
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setIsSubmitting(true);
    setValStep(4);
    
    try {
      const supabase = createClient();
      const makeModel = [selectedBrand, modelText].filter(Boolean).join(" ") || "Not specified";
      const message = `Valuation Request:\nMake & Model: ${makeModel}\nYear: ${selectedYear || "Not specified"}\nChassis No: ${chassisNo || "Not specified"}\nKms Driven: ${kmsDriven || "Not specified"}\nGCC: ${gcc || "Not specified"}`;

      await supabase.from("inquiries").insert({
        name: "Valuation Request",
        email: "info@wheels2deals.com",
        phone: phone || "Not specified",
        message: message,
        status: "new"
      });

      // Send to WhatsApp
      const waText = encodeURIComponent(`Hi Wheels2Deals,\nI would like to get a valuation for my car:\n\nMake & Model: ${makeModel}\nYear: ${selectedYear || "Not specified"}\nChassis No: ${chassisNo || "Not specified"}\nKms Driven: ${kmsDriven || "Not specified"}\nGCC: ${gcc || "Not specified"}\nPhone: ${phone || "Not specified"}`);
      window.open(`https://wa.me/971561498485?text=${waText}`, "_blank");

      setFormSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

            {/* ── Success State ── */}
            {formSuccess ? (
              <div className="flex flex-col items-center text-center py-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 rounded-full bg-[#F0F3E8] flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-[#2A3510]" />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-[24px] font-bold text-[#2A3510] mb-2">
                  Request Submitted!
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[15px] text-[#5A5A5A] leading-relaxed mb-1">
                  Thank you, <span className="font-semibold text-[#2A3510]">{selectedBrand} {modelText}</span>.
                </p>
                <p className="font-[family-name:var(--font-body)] text-[15px] text-[#5A5A5A] leading-relaxed mb-6">
                  Our team will reach out to you within <span className="font-semibold text-[#2A3510]">24 hours</span> with your free market valuation.
                </p>
                <div className="w-full bg-[#F6F5F1] rounded-2xl px-5 py-4 flex items-center gap-3 text-left">
                  <ShieldCheck className="w-5 h-5 text-[#2A3510] shrink-0" />
                  <p className="font-[family-name:var(--font-body)] text-[13px] text-[#2A3510]/70 leading-snug">
                    Check your WhatsApp - we may follow up there too.
                  </p>
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-[#2A3510]">
                Sell Smart, Sell Fast
              </h3>
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-[#2A3510]/50 font-medium">
                STEP 0{formStep} / 03
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#F1F3E1] rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-[#C9A84C] transition-all duration-500 ease-out"
                style={{ width: `${(formStep / 3) * 100}%` }}
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* ── Completed step summaries ── */}
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="flex items-center justify-between w-full bg-[#F6F5F1] rounded-xl px-4 py-2.5 text-left group hover:bg-[#EDF1E3] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A3510]/40">Make & Model</span>
                    <p className="text-[13px] font-semibold text-[#2A3510] leading-tight mt-0.5">
                      {selectedBrand}{modelText ? ` · ${modelText}` : ""}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </button>
              )}
              {formStep > 2 && (
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="flex items-center justify-between w-full bg-[#F6F5F1] rounded-xl px-4 py-2.5 text-left group hover:bg-[#EDF1E3] transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A3510]/40">Details</span>
                    <p className="text-[13px] font-semibold text-[#2A3510] leading-tight mt-0.5">
                      {[selectedYear, kmsDriven ? `${kmsDriven} km` : "", gcc].filter(Boolean).join(" · ") || "-"}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </button>
              )}

              {/* ── Step 1: Make & Model ── */}
              {formStep === 1 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">
                        Brand
                      </label>
                      {errors.brand && <span className="text-[11px] text-red-500 font-medium">{errors.brand}</span>}
                    </div>
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
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-center leading-tight">
                        {brand.name}
                      </span>
                    </button>
                  ))}
                  
                  {/* Dropdown for More Brands */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => brandDropdownOpen ? setBrandDropdownOpen(false) : handleOpenMoreBrands()}
                      className={`w-full h-full min-h-[64px] py-2 px-1 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
                        (selectedBrand && !BRANDS.some(b => b.name === selectedBrand)) || brandDropdownOpen
                          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/5 text-[#C9A84C] shadow-sm ring-2 ring-[#C9A84C]/20"
                          : "border border-[#2A3510]/10 text-[#2A3510]/70 hover:border-[#2A3510]/30 hover:bg-[#F1F3E1]"
                      }`}
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${brandDropdownOpen ? 'rotate-180' : ''}`} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-center leading-tight truncate px-1 max-w-full w-full">
                        {(selectedBrand && !BRANDS.some(b => b.name === selectedBrand)) ? selectedBrand : "More"}
                      </span>
                    </button>

                    {brandDropdownOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setBrandDropdownOpen(false)} 
                        />
                        <div className="absolute bottom-[calc(100%+8px)] right-0 w-[280px] sm:w-[320px] bg-white border border-[#2A3510]/10 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                          <div className="p-2 border-b border-[#2A3510]/5">
                            <input
                              type="text"
                              autoFocus
                              placeholder="Other brand? Search or type a name…"
                              value={customBrand}
                              onChange={(e) => setCustomBrand(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && customBrand.trim()) {
                                  handleBrandClick(customBrand.trim());
                                  setBrandDropdownOpen(false);
                                  setCustomBrand("");
                                }
                              }}
                              className="w-full bg-[#F1F3E1] rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#C9A84C]/40 placeholder:text-[#2A3510]/35"
                            />
                          </div>

                          <div
                            className="max-h-[220px] overflow-y-auto overscroll-contain flex flex-col py-1"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                          >
                            {makesLoading ? (
                              <div className="px-4 py-6 text-center text-[12px] text-[#2A3510]/40 font-medium">Loading makes…</div>
                            ) : (() => {
                              const filtered = allMakes.filter((b) =>
                                b.toLowerCase().includes(customBrand.toLowerCase())
                              );
                              if (filtered.length === 0 && customBrand.trim()) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleBrandClick(customBrand.trim());
                                      setBrandDropdownOpen(false);
                                      setCustomBrand("");
                                    }}
                                    className="text-left px-4 py-3 text-[13px] font-semibold text-[#C9A84C] hover:bg-[#F1F3E1] transition-colors"
                                  >
                                    Use &ldquo;{customBrand.trim()}&rdquo; →
                                  </button>
                                );
                              }
                              return filtered.map((b) => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => {
                                    handleBrandClick(b);
                                    setBrandDropdownOpen(false);
                                    setCustomBrand("");
                                  }}
                                  className={`text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#F1F3E1] ${selectedBrand === b ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                                >
                                  {b}
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">
                    Model
                  </label>
                  {errors.model && <span className="text-[11px] text-red-500 font-medium">{errors.model}</span>}
                </div>

                {modelOptions.length > 0 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setModelDropdownOpen(!modelDropdownOpen);
                        setTimeout(() => modelSearchRef.current?.focus(), 50);
                      }}
                      className="w-full flex items-center justify-between bg-[#F1F3E1] border-2 border-transparent rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-[#C9A84C]/50 transition-all"
                    >
                      <span className={modelText ? "text-[#2A3510]" : "text-[#2A3510]/50"}>
                        {modelText || "Select model"}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 text-[#2A3510]/50 ${modelDropdownOpen ? "rotate-180 text-[#C9A84C]" : ""}`} />
                    </button>

                    {modelDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setModelDropdownOpen(false)} />
                        <div className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-white border border-[#2A3510]/10 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                          <div className="p-2 border-b border-[#2A3510]/5">
                            <input
                              ref={modelSearchRef}
                              type="text"
                              value={modelSearch}
                              onChange={(e) => setModelSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && modelSearch.trim()) {
                                  const filtered = modelOptions.filter((m) =>
                                    m.toLowerCase().includes(modelSearch.toLowerCase())
                                  );
                                  const pick = filtered.length === 1 ? filtered[0] : modelSearch.trim();
                                  setModelText(pick);
                                  setModelDropdownOpen(false);
                                  setModelSearch("");
                                }
                              }}
                              placeholder="Search or type a model…"
                              className="w-full bg-[#F1F3E1] rounded-lg px-3 py-2 text-[13px] outline-none placeholder:text-[#2A3510]/30"
                            />
                          </div>
                          <div
                            className="max-h-[200px] overflow-y-auto overscroll-contain flex flex-col py-1"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            {(() => {
                              const filtered = modelOptions.filter((m) =>
                                m.toLowerCase().includes(modelSearch.toLowerCase())
                              );
                              if (filtered.length === 0 && modelSearch.trim()) {
                                return (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModelText(modelSearch.trim());
                                      setModelDropdownOpen(false);
                                      setModelSearch("");
                                    }}
                                    className="text-left px-4 py-3 text-[13px] font-semibold text-[#C9A84C] hover:bg-[#F1F3E1] transition-colors"
                                  >
                                    Use &ldquo;{modelSearch.trim()}&rdquo; →
                                  </button>
                                );
                              }
                              return filtered.map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => {
                                    setModelText(m);
                                    setModelDropdownOpen(false);
                                    setModelSearch("");
                                    if (valStep < 2) setValStep(2);
                                  }}
                                  className={`text-left px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#F1F3E1] ${modelText === m ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                                >
                                  {m}
                                </button>
                              ));
                            })()}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <input
                    type="text"
                    value={modelText}
                    placeholder={modelsLoading ? "Loading models…" : selectedBrand ? "Type model name" : "Select a make first"}
                    disabled={modelsLoading}
                    onChange={(e) => { setModelText(e.target.value); if (valStep < 2) setValStep(2); }}
                    className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30 disabled:opacity-50"
                  />
                )}
              </div>

                  {/* Step 1 Next button */}
                  <button
                    type="button"
                    onClick={goToStep2}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-[family-name:var(--font-body)] text-[14px] font-bold transition-all duration-300 bg-[#2A3510] text-white hover:bg-[#3a4a1a]"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── Step 2: Car Details ── */}
              {formStep === 2 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Year</label>
                        {errors.year && <span className="text-[11px] text-red-500 font-medium">{errors.year}</span>}
                      </div>
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
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setYearDropdownOpen(false)} 
                      />
                      <div className="absolute bottom-[calc(100%+6px)] left-0 w-full bg-white border border-[#2A3510]/10 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-3 bg-[#F1F3E1]/50 border-b border-[#2A3510]/5 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Select Year</span>
                        </div>
                        <div 
                          className="max-h-[220px] overflow-y-auto overscroll-contain flex flex-col py-1"
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                        >
                          {Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => (new Date().getFullYear() - i).toString()).map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => handleYearSelect(year)}
                              className={`w-full text-left px-4 py-2.5 hover:bg-[#F1F3E1] transition-colors text-[13px] font-medium ${selectedYear === year ? "text-[#C9A84C] bg-[#C9A84C]/5" : "text-[#2A3510]"}`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60 mb-2">
                    Chassis No
                  </label>
                  <input
                    type="text"
                    value={chassisNo}
                    placeholder="Last 6 digits / VIN"
                    onChange={(e) => { setChassisNo(e.target.value); handleDetailChange(); }}
                    className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30"
                  />
                </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Kms Driven</label>
                        {errors.kmsDriven && <span className="text-[11px] text-red-500 font-medium">{errors.kmsDriven}</span>}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={kmsDriven}
                        placeholder="e.g. 45,000"
                        onChange={(e) => {
                          const raw = e.target.value.replace(/[^\d]/g, "");
                          const formatted = raw ? Number(raw).toLocaleString() : "";
                          setKmsDriven(formatted);
                          clearError("kmsDriven");
                          handleDetailChange();
                        }}
                        className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Specs</label>
                        {errors.gcc && <span className="text-[11px] text-red-500 font-medium">{errors.gcc}</span>}
                      </div>
                      <div className="flex gap-2 h-[46px]">
                        {(["GCC", "Non-GCC"] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { setGcc(opt); clearError("gcc"); handleDetailChange(); }}
                            className={`flex-1 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                              gcc === opt
                                ? "bg-[#C9A84C] text-[#2A3510] shadow-sm"
                                : "bg-[#F1F3E1] text-[#2A3510]/60 hover:bg-[#E8EDD8]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2 navigation */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setErrors({}); setFormStep(1); }}
                      className="flex items-center gap-2 px-5 py-3 rounded-full font-[family-name:var(--font-body)] text-[14px] font-bold transition-all duration-300 bg-[#F1F3E1] text-[#2A3510] hover:bg-[#E8EDD8]"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={goToStep3}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-[family-name:var(--font-body)] text-[14px] font-bold transition-all duration-300 bg-[#2A3510] text-white hover:bg-[#3a4a1a]"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Contact ── */}
              {formStep === 3 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-wider text-[#2A3510]/60">Phone number</label>
                      {errors.phone && <span className="text-[11px] text-red-500 font-medium">{errors.phone}</span>}
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      placeholder="+971 50 000 0000"
                      onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                      className="w-full bg-[#F1F3E1] border-none rounded-xl px-4 py-3 text-[#2A3510] text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#C9A84C]/50 placeholder:text-[#2A3510]/30"
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="flex items-center gap-2 px-5 py-3 rounded-full font-[family-name:var(--font-body)] text-[14px] font-bold transition-all duration-300 bg-[#F1F3E1] text-[#2A3510] hover:bg-[#E8EDD8] shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <PremiumCTA
                      type="submit"
                      variant="gold"
                      size="sm"
                      text={isSubmitting ? "Calculating..." : formSuccess ? "We'll WhatsApp you ✓" : "Sell My Car"}
                      className="flex-1 min-w-0"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#2A3510]/50 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                Free, instant & no obligation.
              </div>
            </form>
            </>
            )}
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
      <section className="py-32 px-6 text-center bg-white rounded-b-[40px] md:rounded-b-[60px]">
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

      {/* Gap matching Footer Layout */}
      <div className="h-24 md:h-15 bg-[var(--color-page-bg)]" />

      <FooterSection />
    </main>
  );
}
