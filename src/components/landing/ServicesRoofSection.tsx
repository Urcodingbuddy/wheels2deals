"use client";

import {
  ArrowRight,
  Wallet,
  ShieldCheck,
  BadgeDollarSign,
  CarFront,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    number: "01",
    icon: CarFront,
    title: "Car Buying Support",
    description:
      "End-to-end assistance for a smart, stress-free purchase.",
    href: "/buying",
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    number: "02",
    icon: BadgeDollarSign,
    title: "Car Selling Support",
    description:
      "Sell your vehicle quickly, securely, and at the best price.",
    href: "/selling",
    className: "md:col-span-2 lg:col-span-2",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Inspection, Passing & Ownership Transfer",
    description:
      "Hassle-free vehicle compliance and administrative support.",
    href: "/inspection-and-transfer",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Car Insurance Services",
    description:
      "Tailored coverage from trusted insurers at the best rates.",
    href: "/insurance",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    number: "05",
    icon: Wallet,
    title: "Car Finance & Loan Assistance",
    description:
      "Competitive rates and flexible repayment plans made easy.",
    href: "/finance",
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    number: "06",
    icon: Sparkles,
    title: "Car Detailing & Protection",
    description:
      "Polish, ceramic coating, and premium aesthetic care.",
    href: "/detailing",
    className: "md:col-span-1 lg:col-span-1",
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
        </div>

        {/* Cards grid (Desktop) / Horizontal Scroll (Mobile) */}
        <div className="relative z-10">
          {/* Mobile View: Horizontal Scroll */}
          <div className="flex md:hidden overflow-x-auto overflow-y-hidden gap-4 pb-6 no-scrollbar -mx-6 px-6 snap-x snap-mandatory">
            {services.map((service, i) => (
              <div key={service.number} className="flex-shrink-0 w-[280px] snap-center h-[340px]">
                <ServiceCard {...service} delay={i + 1} isCarousel={true} />
              </div>
            ))}
          </div>

          {/* Desktop View: Bento Grid */}
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
  className = "",
}: {
  number: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  href: string;
  delay: number;
  isCarousel?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${!isCarousel ? `reveal reveal-delay-${delay} ${className}` : "h-full"} group relative bg-white/[0.10] backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/15 transition-all duration-300 cursor-pointer no-underline flex flex-col`}
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
      <div className="flex-1">
        <h3 className="font-[family-name:var(--font-display)] text-white font-bold text-xl mb-3 pr-12">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-body)] text-white/85 text-[14px] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Learn more */}
      <div className="flex items-center gap-1.5 mt-auto pt-5">
        <span className="relative group/link text-[#C9A84C] font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-wider group-hover:text-[#E8D5A3] transition-colors py-0.5">
          Learn more
          <span className="absolute left-0 bottom-0 right-full h-[1.5px] bg-[#C9A84C] transition-all duration-300 ease-out group-hover:right-0" />
        </span>
        <ArrowRight className="w-4 h-4 text-[#C9A84C] group-hover:text-[#E8D5A3] group-hover:translate-x-1.5 transition-all duration-300" />
      </div>
    </Link>
  );
}
