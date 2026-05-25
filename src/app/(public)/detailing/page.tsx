import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { ServiceInquiryForm } from "@/components/shared/ServiceInquiryForm";

const features = [
  {
    title: "Car Polishing",
    description:
      "Multi-stage polish removes swirl marks, oxidation, and light scratches for deep gloss.",
  },
  {
    title: "Ceramic Coating",
    description:
      "Long-lasting hydrophobic protection that defends paint from UV, dirt, and chemicals.",
  },
  {
    title: "Paint Protection Film",
    description:
      "Invisible PPF shield against rock chips, scratches, and road debris damage.",
  },
  {
    title: "Interior Detailing",
    description:
      "Deep cleaning, leather conditioning, and fabric treatment for a like-new cabin.",
  },
  {
    title: "Headlight Restoration",
    description:
      "Restores clarity to faded, yellowed lenses for safer night driving and a fresh look.",
  },
  {
    title: "Engine Bay Detailing",
    description:
      "Professional cleaning and dressing that protects components and elevates presentation.",
  },
];

export default function DetailingPage() {
  return (
    <main className="relative min-h-screen bg-[var(--color-page-bg)] text-white selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <LandingNav />

      <div className="bg-[#2A3510] rounded-b-[40px] md:rounded-b-[60px] pb-20 relative overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: "url('/services_bg.jpg')" }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#2A3510]/50 via-[#2A3510]/70 to-[#2A3510]/90" />

        <section className="relative z-10 pt-40 pb-20 px-6">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_460px] gap-16 items-start">
            <div className="max-w-[980px]">
              <Link
                href="/#services"
                className="mb-12 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-[family-name:var(--font-body)] text-[13px] font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Services
              </Link>

              <span className="mb-4 inline-block font-[family-name:var(--font-body)] text-[14px] font-bold uppercase tracking-[0.22em] text-[#C9A84C]">
                W2D Services
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,6vw,80px)] font-bold text-white leading-[1.05] tracking-tight mb-8">
                Car Detailing &amp; Protection
              </h1>
              <p className="font-[family-name:var(--font-body)] text-[20px] md:text-[24px] text-white/80 max-w-3xl leading-relaxed">
                Showroom shine. Long-lasting protection. Real value retention.
              </p>
              <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/70 max-w-3xl leading-relaxed mt-8">
                A well-detailed car isn&apos;t just beautiful - it&apos;s better protected, holds resale value, and feels brand new every time you step inside. Our detailing services go far beyond a standard wash. From deep interior treatments to ceramic coatings that defend your paint for years, we restore, refine, and shield your vehicle with premium products and meticulous craftsmanship.
              </p>
            </div>

            <div className="lg:sticky lg:top-8 self-start">
              <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-[#F0EDE8]">
                  <h2 className="font-[family-name:var(--font-display)] text-[26px] font-semibold text-[#2A3510] uppercase tracking-[-0.02em] leading-tight">
                    Book Detailing
                  </h2>
                  <p className="font-[family-name:var(--font-body)] text-[15px] text-[#555555] mt-1">
                    Ceramic Coating, Polish &amp; Protection
                  </p>
                </div>
                <ServiceInquiryForm serviceName="Detailing — Ceramic Coating, Polish & Protection" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 pb-32 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="mb-24">
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-white mb-12">
                What&apos;s Included
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-12 gap-x-12">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-start">
                    <div className="flex items-center gap-4 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-[#C9A84C] flex-shrink-0" />
                      <h3 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-white leading-tight">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-[16px] text-white/60 leading-relaxed pl-10">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-24 border-l-4 border-[#C9A84C] pl-8 md:pl-12 py-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-white mb-6">
                Why It Matters
              </h2>
              <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[22px] text-[#C9A84C] leading-relaxed italic">
                &ldquo;Detailing isn&apos;t a luxury - it&apos;s an investment. Ceramic coatings can extend paint life by years, polished interiors fetch higher resale values, and a well-maintained car simply feels better to own. We treat every vehicle as if it were our own.&rdquo;
              </p>
            </div>

            <div className="pt-16 border-t border-white/10">
              <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to get started?
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[18px] md:text-[20px] text-white/60 mb-10 max-w-2xl">
                Contact our experts today on WhatsApp for immediate assistance with car detailing, ceramic coating, polishing, and paint protection.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="h-24 md:h-15 bg-[var(--color-page-bg)]" />
      <FooterSection />
    </main>
  );
}
