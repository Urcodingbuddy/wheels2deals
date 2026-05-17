import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Wheels2Deals | Speak to UAE Car Experts",
  description:
    "Contact Wheels2Deals for buying, selling, finance, insurance, inspection, and transfer support across Dubai and the wider UAE.",
  path: "/contact",
  keywords: ["contact Wheels2Deals", "car broker contact UAE", "Dubai car support"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
