"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Mubeen Imtiaz",
      text: "Had an amazing experience selling my car through Wheels2Deals. The entire process was smooth and hassle-free from start to finish. Their team handled everything professionally, making the deal quick and satisfying."
    },
    {
      name: "sabir zafar",
      text: "Big thank you to Wheel2Deals. They made the purchase of my car a seamless experience. The staff was transparent about pricing, and the vehicle was delivered in perfect condition."
    },
    {
      name: "mohamed ahmed",
      text: "I had a fantastic experience dealing with them. They provided great support throughout the process of buying my car, making everything smooth, easy, and stress-free. Professional, honest."
    },
    {
      name: "Bny Bahul",
      text: "It was really a good experience… All the processes were smooth and easy. Strongly recommend this facility."
    },
    {
      name: "naveed khalid",
      text: "Excellent Services. They provide complete car buying and selling services. Sold my car through them and experience was hassle free"
    },
    {
      name: "Nazish warsi",
      text: "It was an awesome experience to use the best car service."
    }
  ];

  // Double the array for infinite effect
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="reviews" className="pt-24 pb-40 bg-[var(--color-page-bg)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 mb-16">
        <div className="max-w-2xl">
          <p className="mb-3 font-[family-name:var(--font-body)] text-[13px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
            Real Experiences
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,48px)] font-bold text-[#2A3510] leading-[1.05] tracking-tight">
            Loved by buyers <span className="italic font-light">&amp;</span> sellers.
          </h2>
        </div>
      </div>

      <div className="relative group">
        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-page-bg)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-page-bg)] to-transparent z-10 pointer-events-none" />

        <div className="flex w-fit animate-infinite-scroll group-hover:[animation-play-state:paused]">
          {allTestimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="w-[350px] md:w-[450px] flex-shrink-0 px-4"
            >
              <div className="bg-white/40 backdrop-blur-sm border border-[#2A3510]/5 p-8 md:p-10 rounded-[32px] h-full flex flex-col hover:border-[#C9A84C]/30 transition-colors duration-500">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="font-[family-name:var(--font-body)] text-[16px] md:text-[18px] text-[#2A3510]/80 leading-relaxed mb-8 flex-grow italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#2A3510]/5 flex items-center justify-center font-bold text-[#2A3510] text-[12px] uppercase">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#2A3510] capitalize">
                      {t.name}
                    </h4>
                    <p className="font-[family-name:var(--font-body)] text-[11px] text-[#C9A84C] uppercase tracking-widest font-bold">
                      Verified Client
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
