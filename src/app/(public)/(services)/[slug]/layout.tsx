import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

const serviceMetadata: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  buying: {
    title: "Car Buying Support in the UAE | Wheels2Deals",
    description:
      "Get expert car buying support in the UAE with verified listings, inspections, negotiation help, and paperwork coordination from Wheels2Deals.",
    keywords: ["buying a car UAE", "used car buying support Dubai", "car inspection before buying UAE"],
  },
  selling: {
    title: "Car Selling Support in the UAE | Wheels2Deals",
    description:
      "Sell your car smarter with valuation, listing support, buyer screening, negotiation, and safe handover coordination from Wheels2Deals.",
    keywords: ["sell my car UAE", "car selling support Dubai", "car brokerage sellers UAE"],
  },
  "inspection-and-transfer": {
    title: "RTA Inspection & Ownership Transfer in Dubai | Wheels2Deals",
    description:
      "Book certified vehicle inspections, passing support, registration renewals, and ownership transfer help across Dubai and the UAE.",
    keywords: ["RTA inspection Dubai", "ownership transfer Dubai", "Mulkiya renewal UAE"],
  },
  insurance: {
    title: "Compare Car Insurance in the UAE | Wheels2Deals",
    description:
      "Compare car insurance quotes in the UAE with clear policy guidance, renewals, and claims support from trusted Wheels2Deals partners.",
    keywords: ["car insurance UAE", "car insurance Dubai", "compare car insurance UAE"],
  },
  finance: {
    title: "Car Finance in the UAE | Compare Rates & Loan Support",
    description:
      "Compare UAE car finance options, understand loan costs, and get help with approvals and paperwork through Wheels2Deals.",
    keywords: ["car finance UAE", "used car loan Dubai", "car loan rates UAE"],
  },
  detailing: {
    title: "Car Detailing & Ceramic Coating in Dubai | Wheels2Deals",
    description:
      "Protect and refresh your vehicle with detailing, polishing, ceramic coating, paint protection film, and interior care services in the UAE.",
    keywords: ["car detailing Dubai", "ceramic coating Dubai", "paint protection film UAE"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = serviceMetadata[slug];

  if (!page) notFound();

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/${slug}`,
    keywords: page.keywords,
  });
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
