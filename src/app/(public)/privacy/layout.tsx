import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the Wheels2Deals privacy policy covering data collection, processing, storage, and your rights under UAE law.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
