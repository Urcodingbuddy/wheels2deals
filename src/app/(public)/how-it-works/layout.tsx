import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How Wheels2Deals Works | Buy, Sell, Finance, Insure & Transfer",
  description:
    "See how Wheels2Deals handles the full UAE car journey, from verified listings and valuations to finance, insurance, inspections, and RTA ownership transfer.",
  path: "/how-it-works",
  keywords: ["how to buy a car UAE", "how to sell a car UAE", "RTA transfer process Dubai"],
});

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
