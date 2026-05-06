"use client";

import {
  ArrowRight,
  Wallet,
  CircleCheckBig,
  ShieldCheck,
  FileKey,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    number: "01",
    icon: Wallet,
    title: "Finance & Loans",
    description:
      "UAE-wide assistance with expert support for locals and expats.",
    href: "/finance",
  },
  {
    number: "02",
    icon: CircleCheckBig,
    title: "RTA Inspection",
    description:
      "UAE-wide assistance with expert support for locals and expats.",
    href: "/inspect",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Car Insurance",
    description:
      "UAE-wide assistance with expert support for locals and expats.",
    href: "/insurance",
  },
  {
    number: "04",
    icon: FileKey,
    title: "Registration & Transfer",
    description:
      "UAE-wide assistance with expert support for locals and expats.",
    href: "/transfer",
  },
];

export function ServicesRoofSection() {
  return (
    <section id="services" className="px-3.5 py-4">
      <div className="relative max-w-[1440px] mx-auto rounded-[24px] px-6 md:px-12 lg:px-16 py-20 md:py-24 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/services_bg.jpg')`,
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Header */}
        <div className="reveal relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-10">
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            <span className="text-white">Everything You Need</span>
            <br />
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] bg-clip-text text-transparent">
              Under One Roof
            </span>
          </h2>

          {/* 
          <Link
            href="/services"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white font-[family-name:var(--font-body)] text-sm font-medium hover:bg-white/10 transition-colors w-fit no-underline"
          >
            All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          */}
        </div>

        {/* Cards grid (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="relative z-10">
          {/* Mobile View: Horizontal Scroll */}
          <div className="flex md:hidden overflow-x-auto overflow-y-hidden gap-4 pb-6 no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
            {services.map((service, i) => (
              <div key={service.number} className="flex-shrink-0 w-[280px] snap-center">
                <ServiceCard {...service} delay={i + 1} isCarousel={true} />
              </div>
            ))}
          </div>

          {/* Desktop View: Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.number} {...service} delay={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  number,
  icon: Icon,
  title,
  description,
  href,
  delay,
  isCarousel = false,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  href: string;
  delay: number;
  isCarousel?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`${!isCarousel ? `reveal reveal-delay-${delay}` : ""} group relative bg-white/[0.08] backdrop-blur-xl border border-white/10 rounded-2xl p-7 hover:bg-white/15 transition-all duration-300 cursor-pointer no-underline block`}
    >
      {/* Card number */}
      <span className="absolute top-6 right-7 text-[#C9A84C]/20 text-5xl font-bold font-[family-name:var(--font-display)] tracking-tighter">
        {number}
      </span>

      {/* Icon */}
      <div className="mb-6 w-12 h-12 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center group-hover:bg-[#C9A84C]/25 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(201,168,76,0.2)]">
        <Icon
          className="w-6 h-6 text-[#C9A84C] group-hover:text-[#E8D5A3] transition-colors"
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}
      <h3 className="font-[family-name:var(--font-display)] text-white font-bold text-xl mb-3">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-white/85 text-[14px] leading-relaxed mb-8">
        {description}
      </p>

      {/* Learn more */}
      <div className="flex items-center gap-1.5">
        <span className="relative group/link text-[#C9A84C] font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-wider group-hover:text-[#E8D5A3] transition-colors py-0.5">
          Learn more
          <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
        </span>
        <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover:text-[#E8D5A3] group-hover:translate-x-1.5 transition-all duration-300" />
      </div>
    </Link>
  );
}
