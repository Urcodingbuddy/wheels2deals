"use client";

import React from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { PremiumCTA } from "@/components/shared/PremiumCTA";
import { RevealObserver } from "@/components/landing/RevealObserver";
import { 
  ShieldCheck, 
  Zap, 
  Brain, 
  Gem, 
  Search, 
  Banknote, 
  Building2, 
  Wrench,
  Car,
  ClipboardCheck,
  Shield,
  Users
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { num: "200+", label: "Verified Partners" },
    { num: "2,400+", label: "Deals Closed" },
    { num: "98%", label: "Satisfaction Rate" },
    { num: "7", label: "Emirates Covered" },
    { num: "5.3", label: "Avg. Days to Sell" },
    { num: "2min", label: "Insurance Compare" },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Trust",
      desc: "Every partner is vetted. Every deal is tracked. Transparency is non-negotiable — it is the foundation we build on.",
    },
    {
      icon: Zap,
      title: "Speed",
      desc: "The UAE moves fast. Same-day connections, instant quotes, and same-week deal closures are our standard — not our exception.",
    },
    {
      icon: Brain,
      title: "Expertise",
      desc: "Deep UAE market knowledge across RTA, insurance, and finance. We don't just connect people — we guide every step.",
    },
    {
      icon: Gem,
      title: "Prestige",
      desc: "This is the UAE. Standards are high — and we hold ourselves to them. Premium service, every interaction, every time.",
    },
  ];

  const services = [
    { icon: Car, tag: "Buy", title: "Buy a Car", desc: "Vetted inventory across all UAE. Expert matching with verified dealers. Zero commission for buyers — ever." },
    { icon: Banknote, tag: "Sell", title: "Sell Your Car", desc: "Reach 200+ verified buyers instantly. Free valuation, no listing fees, same-week deals are common." },
    { icon: Building2, tag: "Finance", title: "Finance & Loans", desc: "Compare UAE bank rates, calculate your EMI instantly, and get pre-approved in minutes from top lenders." },
    { icon: Search, tag: "Inspect", title: "RTA Inspection", desc: "150-point certified checks by RTA-approved centres across Dubai, Abu Dhabi and Sharjah." },
    { icon: Shield, tag: "Insure", title: "Car Insurance", desc: "Compare 10+ UAE insurers side by side. Best rate found and applied in under 2 minutes." },
    { icon: ClipboardCheck, tag: "Transfer", title: "Transfer & Renewals", desc: "Mulkiya renewal, ownership transfer, NOC services and export plates — all handled same day." },
  ];

  const team = [
    { initials: "AK", name: "Ahmed Al Khalidi", role: "Founder & CEO", bio: "12 years in UAE automotive. Former dealer principal. Built W2D to solve the problem he lived every day." },
    { initials: "SR", name: "Sara Rahman", role: "Head of Partnerships", bio: "Grew W2D's dealer network from 0 to 200+ partners in under 18 months across all 7 emirates." },
    { initials: "MJ", name: "Malik Jassim", role: "Head of Technology", bio: "Led digital platforms at two major UAE automotive groups before joining W2D to build the future." },
    { initials: "LA", name: "Layla Al Ameri", role: "Head of Client Success", bio: "Personally oversees quality for every partner relationship. The reason our satisfaction rate is 98%." },
  ];

  return (
    <main className="relative min-h-screen bg-[#2A3510] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <RevealObserver />
      <LandingNav />

      {/* Fixed Cinematic Background Pattern */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: `url('/services_bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-[#2A3510]/80 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 md:px-12 overflow-hidden bg-transparent">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.15),transparent_70%)] pointer-events-none z-0" />

        <div className="relative z-10 max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="inline-block mb-4 md:mb-6 font-[family-name:var(--font-body)] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
              About Wheels2Deals
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,7vw,100px)] font-bold text-white leading-[0.95] md:leading-[0.9] tracking-tighter mb-12">
              We Don't Sell Cars.<br />
              <span className="italic font-light text-[#C9A84C]">We Make Deals Happen.</span>
            </h1>
            <p className="font-[family-name:var(--font-body)] text-white/70 text-[18px] md:text-[22px] leading-relaxed mb-10 max-w-lg">
              Born in Dubai. Built for the UAE. W2D is the intelligent broker platform connecting every buyer, seller, dealer and service partner — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <PremiumCTA href="/buy" text="Start a Deal" variant="primary" />
              <PremiumCTA href="/contact" text="Partner With Us" variant="outline" />
            </div>
          </div>

          <div className="reveal hidden lg:block" style={{ transitionDelay: '0.2s' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#C9A84C]/20 blur-xl rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-white/[0.03] font-black text-8xl pointer-events-none tracking-tighter">W2D</div>
                
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-[1px] bg-[#C9A84C]/40" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] opacity-80">The Bridge Model</p>
                </div>
                
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-10">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all duration-500 group/node">
                    <Users className="w-8 h-8 text-[#C9A84C] mx-auto mb-3 transition-transform group-hover/node:scale-110" />
                    <span className="block text-[12px] font-bold uppercase tracking-widest text-white">Buyers</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-[#C9A84C]/40 to-transparent relative" />
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                    <div className="w-12 h-[1px] bg-gradient-to-l from-[#C9A84C]/40 to-transparent relative" />
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-all duration-500 group/node">
                    <Car className="w-8 h-8 text-[#C9A84C] mx-auto mb-3 transition-transform group-hover/node:scale-110" />
                    <span className="block text-[12px] font-bold uppercase tracking-widest text-white">Sellers</span>
                  </div>
                </div>

                <div className="relative mb-10 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-white/10" />
                  </div>
                  <div className="relative inline-flex items-center justify-center bg-[#2A3510] px-6 py-3 border border-[#C9A84C]/30 rounded-xl shadow-lg">
                     <span className="font-[family-name:var(--font-display)] font-black text-2xl text-[#C9A84C] tracking-tighter">W2D</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Building2 className="w-5 h-5 text-[#C9A84C]/60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Dealers</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Wrench className="w-5 h-5 text-[#C9A84C]/60" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Services</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-transparent py-20 border-y border-white/5 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4">
            {stats.map((s, i) => (
              <div key={i} className="reveal text-center group" style={{ transitionDelay: `${i * 0.1}s` }}>
                <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-black text-[#C9A84C] mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">{s.num}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-32 px-6 md:px-12 relative bg-transparent z-10">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="reveal">
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-6 block font-[family-name:var(--font-body)]">Our Story</span>
            <div className="pl-8 border-l-4 border-[#C9A84C] mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold leading-tight text-white">
                "The Smartest Bridge Between Every Car Deal in the UAE"
              </h2>
            </div>
            <div className="space-y-6 text-white/70 font-[family-name:var(--font-body)] text-[17px] leading-relaxed">
              <p>Wheels2Deals was born from a simple frustration: buying or selling a car in the UAE shouldn't be this hard. Buyers were getting lost in unverified listings. Sellers were leaving money on the table. Dealers were drowning in unqualified leads.</p>
              <p>Everyone was juggling five different platforms just to complete one deal. So we built one platform to fix all of it.</p>
              <p>W2D is not a showroom. We are not a classifieds site. We are the intelligent layer that sits between every buyer, seller, dealer, and service partner — matching the right people, at the right time, with the right verified professionals.</p>
            </div>
          </div>

          <div className="reveal lg:pl-12" style={{ transitionDelay: '0.2s' }}>
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-8 block">The Gap We Saw</span>
            <div className="space-y-4">
              {[
                { icon: Search, title: "Unverified Listings", desc: "Buyers wasted hours on phantom listings and private sellers with no accountability." },
                { icon: Banknote, title: "Sellers Left Money Behind", desc: "Without reach or expertise, sellers settled for less than their car was truly worth." },
                { icon: Building2, title: "Dealers Had No Lead Quality", desc: "Dealer partners wasted resources on cold, unqualified traffic from classifieds." },
                { icon: Wrench, title: "Services Were Disconnected", desc: "Insurance, inspection, finance and RTA paperwork had zero coordination — until now." }
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-6 hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/30 transition-all duration-500 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[16px] mb-1 group-hover:text-[#C9A84C] transition-colors">{item.title}</h4>
                    <p className="text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS SECTION - Rounded Pattern */}
      <section className="py-32 px-6 md:px-12 bg-[#2A3510] text-white rounded-t-[40px] md:rounded-t-[60px] relative z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 reveal">
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-6 block">Our Values</span>
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold mb-6 tracking-tight">Four Pillars. One Standard.</h2>
            <p className="text-white/40 max-w-2xl mx-auto">Every interaction at W2D is governed by these four principles.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="reveal p-10 rounded-[32px] bg-white/5 border border-white/10 hover:bg-[#C9A84C]/5 hover:border-[#C9A84C]/30 transition-all duration-700 group" style={{ transitionDelay: `${i * 0.1}s` }}>
                <p.icon className="w-10 h-10 text-[#C9A84C] mb-8 group-hover:scale-110 transition-transform duration-500" />
                <h4 className="font-[family-name:var(--font-display)] text-xl font-bold mb-4 text-[#C9A84C]">{p.title}</h4>
                <p className="text-white/40 text-[14px] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION - REDESIGNED FOR HIGH IMPACT */}
      <section className="py-32 px-6 md:px-12 bg-[#2A3510] text-white relative z-20 overflow-hidden">
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="mb-20 reveal">
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-6 block font-[family-name:var(--font-body)]">Everything Car</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6.5vw,90px)] font-bold mb-8 tracking-tighter leading-[0.95]">
              One Platform.<br />
              <span className="italic font-light text-[#C9A84C]">Every problem solved.</span>
            </h2>
            <p className="text-white/60 max-w-xl text-[18px] md:text-[20px] leading-relaxed font-[family-name:var(--font-body)]">
              Most car transactions involve five separate moving parts. W2D brings every one of them under a single roof — free for consumers, every time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div key={i} className="reveal group relative p-10 rounded-[40px] bg-white/5 border border-white/10 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-700 backdrop-blur-sm" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#C9A84C]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] transition-all duration-500">
                  <s.icon className="w-8 h-8 text-[#C9A84C] group-hover:text-[#2A3510] transition-colors duration-500" />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] text-[9px] font-bold uppercase tracking-widest border border-[#C9A84C]/20">{s.tag}</span>
                  <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                <h4 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4 text-white group-hover:text-[#C9A84C] transition-colors duration-500">{s.title}</h4>
                <p className="text-white/40 leading-relaxed text-[15px] group-hover:text-white/60 transition-colors duration-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION - REDESIGNED FOR PRESTIGE */}
      <section className="py-32 px-6 md:px-12 bg-[#2A3510] z-20 relative rounded-b-[40px] md:rounded-b-[60px] shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 reveal">
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-6 block font-[family-name:var(--font-body)]">The Team</span>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,6.5vw,90px)] font-bold mb-8 tracking-tighter leading-[0.95] text-white">
              Built by UAE<br />
              <span className="italic font-light text-[#C9A84C]">Automotive Insiders.</span>
            </h2>
            <p className="text-white/60 max-w-xl text-[18px] md:text-[20px] leading-relaxed font-[family-name:var(--font-body)]">
              Deep market experience across every layer of the UAE car industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m, i) => (
              <div key={i} className="reveal group relative bg-white/5 backdrop-blur-sm p-10 rounded-[48px] text-center border border-white/10 hover:border-[#C9A84C]/40 hover:bg-[#C9A84C]/5 transition-all duration-700" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#9E7B2A] flex items-center justify-center mx-auto mb-8 relative shadow-[0_0_30px_rgba(201,168,76,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <span className="font-[family-name:var(--font-display)] text-3xl font-black text-[#2A3510]">{m.initials}</span>
                </div>
                <h4 className="font-[family-name:var(--font-display)] text-xl font-bold mb-1 text-white group-hover:text-[#C9A84C] transition-colors duration-500">{m.name}</h4>
                <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">{m.role}</p>
                <div className="w-8 h-[1px] bg-white/20 mx-auto mb-6" />
                <p className="text-white/40 text-[14px] leading-relaxed group-hover:text-white/60 transition-colors duration-500">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - MATCHING DESIGN PATTERN */}
      <section className="relative py-40 px-6 md:px-12 overflow-hidden bg-transparent z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.1),transparent_70%)] pointer-events-none z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center reveal">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,6vw,90px)] font-bold mb-8 tracking-tighter leading-[1.05]">
            Ready to Experience<br />
            <span className="italic font-light text-[#C9A84C]">the W2D difference.</span>
          </h2>
          <p className="text-white/60 text-[18px] md:text-[24px] mb-12 leading-relaxed max-w-2xl mx-auto">
            Whether you're buying, selling, or looking to partner with us — the conversation starts right here.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <PremiumCTA href="/buy" text="I'm Buying" variant="primary" />
            <PremiumCTA href="/sell" text="I'm Selling" variant="outline" />
          </div>
        </div>
      </section>

      {/* Gap matching Footer Layout */}
      <div className="h-24 md:h-15 bg-[#2A3510]" />

      <FooterSection />
    </main>
  );
}
