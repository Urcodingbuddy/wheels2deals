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
    <section id="services" className="px-10 py-4">
      <div className="relative rounded-[24px] px-6 md:px-12 lg:px-16 py-20 md:py-24 overflow-hidden">
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

          <Link
            href="/services"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white font-[family-name:var(--font-body)] text-sm font-medium hover:bg-white/10 transition-colors w-fit no-underline"
          >
            All Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.number} {...service} delay={i + 1} />
          ))}
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
}: {
  number: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  href: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      className={`reveal reveal-delay-${delay} group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer no-underline block`}
    >
      {/* Card number */}
      <span className="absolute top-6 right-6 text-white/10 text-5xl font-semibold font-[family-name:var(--font-display)]">
        {number}
      </span>

      {/* Icon */}
      <div className="mb-6 w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]">
        <Icon
          className="w-6 h-6 text-[#C9A84C] group-hover:text-[#E8D5A3] transition-colors"
          strokeWidth={1.5}
        />
      </div>

      {/* Content */}
      <h3 className="font-[family-name:var(--font-display)] text-white font-bold text-lg mb-2">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-body)] text-white/60 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Learn more */}
      <span className="group/link flex items-center gap-1.5 text-[#C9A84C] font-[family-name:var(--font-body)] text-sm font-medium group-hover:text-[#E8D5A3] transition-colors">
        Learn more
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
}
