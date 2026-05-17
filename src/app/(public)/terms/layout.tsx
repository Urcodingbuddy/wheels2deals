import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions",
  description:
    "Review the Wheels2Deals terms and conditions for website usage, listings, brokerage services, fees, and dispute handling in the UAE.",
  path: "/terms",
  noIndex: true,
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
