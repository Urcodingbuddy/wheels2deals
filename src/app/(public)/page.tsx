import type { Metadata } from "next";
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
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Buy & Sell Cars in the UAE | Verified Listings & Free Valuation",
  description:
    "Buy verified used cars across the UAE or sell your car fast with a free valuation, inspections, finance support, insurance, and RTA transfer help from Wheels2Deals.",
  path: "/",
  keywords: [
    "buy and sell cars UAE",
    "used cars UAE",
    "car valuation Dubai",
    "verified car listings UAE",
  ],
});

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
