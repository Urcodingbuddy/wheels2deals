import { LandingNav } from "@/components/landing/LandingNav";
import { RevealObserver } from "@/components/landing/RevealObserver";
import { HeroSection } from "@/components/landing/HeroSection";
import { CategorySection } from "@/components/landing/CategorySection";
import { JourneySection } from "@/components/landing/JourneySection";
import { ServicesRoofSection } from "@/components/landing/ServicesRoofSection";
import { BrandsSection } from "@/components/landing/BrandsSection";
import { ShowroomSection } from "@/components/landing/ShowroomSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FooterSection } from "@/components/landing/FooterSection";

export default function HomePage() {
  return (
    <div
      id="page-root"
      style={{ backgroundColor: "var(--color-page-bg)" }}
      className="text-white overflow-x-hidden selection:bg-[#C9A84C] selection:text-[#2A3510]"
    >
      <RevealObserver />
      <LandingNav />
      <HeroSection />
      <CategorySection />
      <JourneySection />
      <ServicesRoofSection />
      <BrandsSection />
      <ShowroomSection />
      <TestimonialSection />
      <FooterSection />
    </div>
  );
}
