import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Pre-Purchase Car Inspection Dubai | Certified Mechanics",
  description:
    "Book a certified pre-purchase car inspection in Dubai. 200-point check, engine, chassis, and full written report - same day.",
  path: "/inspection-and-transfer",
  keywords: ["pre-purchase inspection Dubai", "car inspection UAE", "used car inspection Dubai", "vehicle inspection UAE"],
});

export default function InspectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
