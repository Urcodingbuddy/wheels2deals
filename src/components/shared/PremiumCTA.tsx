"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumCTAProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  text: string;
  className?: string;
  variant?: "primary" | "outline" | "gold";
}

export const PremiumCTA = ({ href, onClick, type = "button", text, className = "", variant = "primary" }: PremiumCTAProps) => {
  const baseClasses = `group relative inline-flex items-center min-w-[200px] h-[56px] rounded-full overflow-hidden transition-all duration-700 shadow-lg border border-white/20 ${
    variant === "primary" 
      ? "bg-[#2A3510] text-white hover:shadow-[#C9A84C]/20" 
      : variant === "gold"
      ? "bg-[#C9A84C] text-[#2A3510] hover:shadow-[#C9A84C]/40"
      : "bg-white text-[#2A3510]"
  } ${className}`;

  const content = (
    <>
      {/* Background Fill on Hover */}
      <div className={`absolute inset-0 transition-transform duration-700 ease-in-out scale-x-0 origin-right group-hover:scale-x-100 ${
        variant === "primary" ? "bg-[#C9A84C]" : "bg-[#2A3510]"
      }`} />

      {/* Text Wrapper - Dynamic padding to center text relative to the circle position */}
      <div className="w-full h-full flex items-center justify-center pl-8 pr-[60px] transition-all duration-700 group-hover:pr-8 group-hover:pl-[60px]">
        <span className={`relative z-10 font-[family-name:var(--font-body)] font-bold text-[12px] md:text-[13px] uppercase tracking-[0.25em] transition-colors duration-700 ${
          variant === "primary" ? "text-white group-hover:text-[#2A3510]" : "text-[#2A3510] group-hover:text-white"
        }`}>
          {text}
        </span>
      </div>

      {/* The Sliding Circle */}
      <div className={`absolute top-1 right-1 z-20 w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-700 ease-in-out ${
        variant === "primary" 
          ? "bg-white text-[#2A3510]" 
          : "bg-white text-[#2A3510]"
      } group-hover:right-[calc(100%-48px-4px)]`}>
        <ArrowRight className="w-5 h-5" />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};
