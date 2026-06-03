"use client";

import { useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { Send } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { PremiumCTA } from "@/components/shared/PremiumCTA";
import { createClient } from "@/lib/client";
import { UAEFlag } from "@/components/shared/UAEFlag";
import { validateUAEPhone, standardizeUAEPhone } from "@/lib/validation";
export default function ContactPage() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { id: "buy", label: "Car Buying Support" },
    { id: "sell", label: "Car Selling Support" },
    { id: "finance", label: "Finance Assistance" },
    { id: "insurance", label: "Insurance Services" },
    { id: "inspection", label: "Inspection & Transfer" },
    { id: "other", label: "General Inquiry" },
  ];

  const selectedLabel = services.find(s => s.id === selectedService)?.label || "Select a Service";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;
    const serviceLabel = services.find(s => s.id === selectedService)?.label || "General Inquiry";

    // Validate phone number for UAE
    if (!validateUAEPhone(phone)) {
      setPhoneError("Please enter a valid UAE phone number.");
      return;
    }
    setPhoneError(null);

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        car_id: null,
        name: name.trim(),
        email: email?.trim() || "info@wheels2deals.com",
        phone: phone ? standardizeUAEPhone(phone) : null,
        message: `Inquiry Type: ${serviceLabel}\n\n${message.trim()}`,
        status: "new",
      });

      if (error) {
        console.error("Contact inquiry error:", error);
        alert("Failed to send your message. Please try again.");
        return;
      }

      formElement.reset();
      setSelectedService("");
      setMessage("");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--color-page-bg)] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
        <LandingNav />
        <section className="relative pt-48 pb-40 px-6 bg-[#2A3510] rounded-b-[40px] md:rounded-b-[80px] shadow-[0_40px_80px_rgba(0,0,0,0.3)] z-10 min-h-[60vh] flex items-center justify-center">
          <div className="max-w-xl mx-auto text-center py-12 px-6 bg-[#1F270B]/50 rounded-[32px] border border-white/5 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mx-auto mb-8 shadow-[0_8px_32px_rgba(201,168,76,0.15)]">
              <svg className="w-10 h-10 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white mb-4">
              Message Sent!
            </h2>
            <p className="text-white/60 text-base md:text-lg font-[family-name:var(--font-body)] leading-relaxed mb-10">
              Thank you for reaching out. A Wheels2Deals consultant will get back to you shortly (usually within 2 hours).
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
              }}
              className="px-8 py-3.5 rounded-full bg-[#C9A84C] text-[#2A3510] hover:bg-[#b0913b] font-[family-name:var(--font-body)] text-[12px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
            >
              Send Another Message
            </button>
          </div>
        </section>
        <div className="h-32 w-full bg-[var(--color-page-bg)]" />
        <FooterSection />
      </main>
    );
  }

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
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-16">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
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
                  className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all text-[17px] peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
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
                  className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all text-[17px] peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
                >
                  Email Address
                </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              {/* Phone Input with UAE Flag */}
              <div className="group relative">
                <div className="flex items-center gap-2 border-b border-white/20 py-4 focus-within:border-[#C9A84C] transition-all relative">
                  <div className="flex items-center gap-1.5 shrink-0 bg-white/5 px-2.5 py-1 rounded border border-white/10 text-white/60">
                    <UAEFlag className="w-5.5 h-3" />
                    <span className="text-[14px] font-bold tracking-wider">+971</span>
                  </div>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent text-xl outline-none"
                    onChange={(e) => {
                      const v = e.target.value;
                      const cleaned = v.replace(/[\s\-()]/g, "");
                      if (!v.trim()) {
                        setPhoneError("Phone number is required");
                      } else if (cleaned.length >= 7 && !validateUAEPhone(v)) {
                        setPhoneError("Please enter a valid UAE phone number.");
                      } else {
                        setPhoneError(null);
                      }
                    }}
                  />
                  <label 
                    htmlFor="phone"
                    className="whitespace-nowrap absolute left-[94px] top-4 text-white/40 pointer-events-none transition-all text-[17px] peer-focus:-top-6 peer-focus:left-0 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
                  >
                    Phone Number
                  </label>
                </div>
                {phoneError && (
                  <p className="absolute left-0 -bottom-6 text-[11px] text-red-400 font-medium">
                    {phoneError}
                  </p>
                )}
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
            </div>

            {/* Message Input */}
            <div className="group relative">
              <textarea 
                id="message"
                name="message"
                required
                rows={1}
                value={message}
                onChange={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                  setMessage(e.target.value);
                }}
                placeholder=" "
                className="peer w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#C9A84C] transition-all resize-none overflow-hidden"
              />
              <label 
                htmlFor="message"
                className="absolute left-0 top-4 text-white/40 pointer-events-none transition-all text-[17px] peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#C9A84C] peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[11px] uppercase tracking-[0.2em] font-bold"
              >
                How can we help?
              </label>
            </div>

            <div className="!mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5">
              {/* Avg Response Time Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] font-[family-name:var(--font-body)] text-[12px] font-semibold uppercase tracking-wider backdrop-blur-sm shadow-[0_4px_20px_rgba(201,168,76,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]"></span>
                </span>
                <span>Avg Response Time: <span className="text-white">24 Hours</span></span>
              </div>

              <PremiumCTA 
                type="submit"
                text={isSubmitting ? "Sending..." : "Send Message"}
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
                SIT Tower, Dubai Silicon Oasis, Dubai, United Arab Emirates
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
