"use client";

import { useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { Send } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { PremiumCTA } from "@/components/shared/PremiumCTA";
export default function ContactPage() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const services = [
    { id: "buy", label: "Car Buying Support" },
    { id: "sell", label: "Car Selling Support" },
    { id: "finance", label: "Finance Assistance" },
    { id: "insurance", label: "Insurance Services" },
    { id: "inspection", label: "Inspection & Transfer" },
    { id: "other", label: "General Inquiry" },
  ];

  const selectedLabel = services.find(s => s.id === selectedService)?.label || "Select a Service";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const serviceLabel = services.find(s => s.id === selectedService)?.label || "General Inquiry";

    const whatsappMessage = `Hi Wheels2Deals! 👋\n\n*Name:* ${name}\n*Email:* ${email}\n*Inquiry:* ${serviceLabel}\n\n*Message:* ${message}`;
    const whatsappUrl = `https://wa.me/971561498485?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      <section className="relative pt-48 pb-40 px-6 bg-[#2A3510] rounded-b-[40px] md:rounded-b-[80px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32">
          <span className="inline-block mb-6 font-[family-name:var(--font-body)] text-[12px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
            Get in touch
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,7vw,90px)] font-bold leading-[1.1] tracking-tight mb-8">
            Let's start <br />
            <span className="italic font-light text-[#C9A84C]">the conversation.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-[family-name:var(--font-body)]">
            Whether you're looking to buy, sell, or simply have a question about the UAE market, our experts are here to help.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-48">
          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Name Input */}
              <div className="group relative">
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#C9A84C] transition-all"
                />
                <label 
                  htmlFor="name"
                  className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="group relative">
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#C9A84C] transition-all"
                />
                <label 
                  htmlFor="email"
                  className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
                >
                  Email Address
                </label>
              </div>
            </div>

            {/* Custom Premium Dropdown */}
            <div className="relative z-50">
              <label className="absolute left-0 -top-8 text-[11px] text-white/40 uppercase tracking-[0.2em] font-bold">
                Inquiry Type
              </label>
              
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`group w-full bg-transparent border-b py-4 text-xl outline-none text-left flex justify-between items-center transition-all duration-500 ${
                  isDropdownOpen ? 'border-[#C9A84C]' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <span className={`transition-colors duration-500 ${selectedService ? 'text-white' : 'text-white/40'}`}>
                  {selectedLabel}
                </span>
                <div className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className={isDropdownOpen ? 'text-[#C9A84C]' : 'text-white/20'}>
                    <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div className="absolute top-full left-0 right-0 mt-4 bg-[#2A3510] border border-white/10 rounded-[24px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="py-3 px-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => {
                            setSelectedService(service.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 rounded-xl text-left text-[17px] font-medium transition-all duration-300 group flex items-center justify-between ${
                            selectedService === service.id 
                              ? 'bg-[#C9A84C] text-[#2A3510]' 
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{service.label}</span>
                          {selectedService === service.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2A3510]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <input type="hidden" name="service" value={selectedService} />
            </div>

            {/* Message Input */}
            <div className="group relative">
              <textarea 
                id="message"
                name="message"
                required
                rows={3}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#C9A84C] transition-all resize-none"
              />
              <label 
                htmlFor="message"
                className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
              >
                How can we help?
              </label>
            </div>

            <div className="pt-20 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-white/5">
              <div className="flex items-center gap-4 text-white/40 group-hover:text-white/60 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <p className="text-[13px] font-[family-name:var(--font-body)] font-medium tracking-wide">
                  Average response time: <span className="text-white/60">2 Hours</span>
                </p>
              </div>

              <PremiumCTA 
                type="submit"
                text="Send Message"
                variant="outline"
              />
            </div>
          </form>
        </div>

        {/* Direct Contact Links */}
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12">
           {/* HQ */}
           <div className="group">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#C9A84C] transition-all duration-500 group-hover:w-16" />
                <h4 className="text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[11px]">Headquarters</h4>
              </div>
              <p className="text-white/80 font-medium leading-loose text-[17px] pl-12 group-hover:text-white transition-colors">
                SIT Tower, Dubai silicon Oasis, UAE
              </p>
           </div>

           {/* Channels */}
           <div className="group">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#C9A84C] transition-all duration-500 group-hover:w-16" />
                <h4 className="text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[11px]">Direct Channels</h4>
              </div>
              <div className="pl-12 space-y-4">
                 <a href="mailto:info@wheels2deals.com" className="block text-white/80 hover:text-[#C9A84C] transition-all font-medium text-[17px] hover:translate-x-2">
                   info@wheels2deals.com
                 </a>
                 <a href="tel:+971561498485" className="block text-white/80 hover:text-[#C9A84C] transition-all font-medium text-[17px] hover:translate-x-2">
                   +971 56 149 8485
                 </a>
              </div>
           </div>

           {/* Social */}
           <div className="group">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#C9A84C] transition-all duration-500 group-hover:w-16" />
                <h4 className="text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[11px]">Follow Our Drive</h4>
              </div>
              <div className="pl-12 flex gap-6">
                <a 
                  href={`https://wa.me/971561498485?text=${encodeURIComponent("Hi, I'm reaching out from the Wheels2Deals Contact page. I'd like to inquire about your services.")}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/40 hover:text-[#C9A84C] transition-all hover:-translate-y-1"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/wheels2dealsfze/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C9A84C] transition-all hover:-translate-y-1">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/people/Wheels2Deals/100052648911178/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C9A84C] transition-all hover:-translate-y-1">
                  <FaFacebookF className="w-6 h-6" />
                </a>
              </div>
           </div>
        </div>
      </section>

      <div className="h-32 w-full bg-[var(--color-page-bg)]" /> {/* Spacer gap before footer */}

      <FooterSection />
    </main>
  );
}
