import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Car Detailing & Ceramic Coating in Dubai | Wheels2Deals",
  description:
    "Protect and refresh your vehicle with detailing, polishing, ceramic coating, paint protection film, and interior care services in the UAE.",
  path: "/detailing",
  keywords: ["car detailing Dubai", "ceramic coating Dubai", "paint protection film UAE"],
});

export default function DetailingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
