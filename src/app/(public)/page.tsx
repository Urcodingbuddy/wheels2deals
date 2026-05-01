import { LandingNav } from "@/components/landing/LandingNav";
import { RevealObserver } from "@/components/landing/RevealObserver";
import { LandingColorShift } from "@/components/landing/LandingColorShift";
import { HeroSection } from "@/components/landing/HeroSection";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { JourneySection } from "@/components/landing/JourneySection";
import { QuoteSection } from "@/components/landing/QuoteSection";
import { BannerSection } from "@/components/landing/BannerSection";
import { ShowroomSection } from "@/components/landing/ShowroomSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function HomePage() {
  return (
    <div
      id="page-root"
      style={{ backgroundColor: "#ffffff" }}
      className="text-white overflow-x-hidden selection:bg-[#1A6B3C] selection:text-white"
    >
      <RevealObserver />
      <LandingColorShift />
      <LandingNav />
      <HeroSection />
      <BrandsSection />
      <JourneySection />
      <QuoteSection />
      <BannerSection />
      <ShowroomSection />
      <FooterSection />
    </div>
  );
}
