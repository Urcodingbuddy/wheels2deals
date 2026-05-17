import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Wheels2Deals | The UAE's Smart Car Broker",
  description:
    "Learn how Wheels2Deals connects buyers, sellers, dealers, and automotive service partners across the UAE through one trusted car brokerage platform.",
  path: "/about",
  keywords: ["about Wheels2Deals", "car broker Dubai", "UAE automotive brokerage"],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
