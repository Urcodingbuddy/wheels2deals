"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";

export function WhatsAppSticky() {
  const pathname = usePathname();
  const phoneNumber = "971501568003";

  const getMessage = () => {
    if (pathname === "/") return "Hi Wheels2Deals, I'm on your homepage and would like to learn more about your car services.";
    if (pathname === "/about") return "Hi Wheels2Deals, I'm reading about you and would like to know more about the team and the bridge model.";
    if (pathname === "/buy") return "Hi Wheels2Deals, I'm browsing your listings and would like help finding the right car.";
    if (pathname === "/sell") return "Hi Wheels2Deals, I want to sell my car and would like a free valuation.";
    if (pathname === "/how-it-works") return "Hi Wheels2Deals, I have a question about how your process works.";
    if (pathname.startsWith("/buy/")) return `Hi Wheels2Deals, I'm interested in this specific car: ${pathname.split("/").pop()}.`;
    
    return "Hi Wheels2Deals, I'd like to inquire about your services.";
  };

  const encodedMessage = encodeURIComponent(getMessage());
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {/* Call Button */}
      <div className="group relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-[#2A3510] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none">
          Call us
          <div className="absolute top-full right-6 w-2 h-2 bg-[#2A3510] border-r border-b border-white/10 rotate-45 -translate-y-1" />
        </div>

        <a
          href={`tel:+${phoneNumber}`}
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#2A3510] text-white shadow-[0_10px_30px_rgba(42,53,16,0.3)] border border-white/10 hover:scale-110 transition-transform duration-300 active:scale-95"
          aria-label="Call us"
        >
          <Phone className="w-5 h-5 md:w-6 md:h-6" />
        </a>
      </div>

      {/* WhatsApp Button */}
      <div className="group relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-[#2A3510] text-white text-[11px] font-bold uppercase tracking-widest rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none">
          Chat with us
          <div className="absolute top-full right-6 w-2 h-2 bg-[#2A3510] border-r border-b border-white/10 rotate-45 -translate-y-1" />
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-[0_10px_30px_rgb(0,0,0,0.2)] border border-black/5 hover:scale-110 transition-transform duration-300 overflow-hidden active:scale-95"
          aria-label="Contact us on WhatsApp"
        >
          <img
            src="/whatsapp.png"
            alt="WhatsApp"
            className="w-full h-full object-contain p-3"
          />
        </a>
        
        {/* Pulse Effect */}
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 pointer-events-none group-hover:hidden" />
      </div>
    </div>
  );
}
