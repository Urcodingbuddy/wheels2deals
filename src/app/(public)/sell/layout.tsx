import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sell My Car in the UAE | Free Car Valuation & Brokerage Support",
  description:
    "Sell your car fast in Dubai and across the UAE with free valuation, home inspection, verified buyers, and full paperwork support from Wheels2Deals.",
  path: "/sell",
  keywords: ["sell my car Dubai", "sell my car UAE", "car valuation UAE", "sell used car Dubai"],
});

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
