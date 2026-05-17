import type { Metadata } from "next";
import type { Tables } from "@/types/database";

export const siteConfig = {
  name: "Wheels2Deals",
  shortName: "W2D",
  domain: "https://www.wheels2deals.com",
  title: "Wheels2Deals | Buy & Sell Cars in the UAE",
  description:
    "Wheels2Deals is the UAE's trusted car brokerage platform. Buy verified used cars or sell yours fast across Dubai, Abu Dhabi, Sharjah, and all 7 Emirates.",
  keywords: [
    "buy used cars UAE",
    "used cars for sale Dubai",
    "sell my car UAE",
    "sell my car Dubai",
    "car broker UAE",
    "car finance UAE",
    "car insurance Dubai",
    "RTA transfer Dubai",
    "used car valuation UAE",
  ],
  phone: "+971561498485",
  email: "info@wheels2deals.com",
  address: "SIT Tower, Dubai Silicon Oasis, Dubai, United Arab Emirates",
  socialLinks: [
    "https://www.instagram.com/wheels2dealsfze/",
    "https://www.facebook.com/people/Wheels2Deals/100052648911178/",
  ],
} as const;

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) {
    return new URL(`/${path}`, siteConfig.domain).toString();
  }

  return new URL(path, siteConfig.domain).toString();
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  type = "website",
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialImage = image ?? absoluteUrl("/opengraph-image");

  return {
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        "en-AE": canonical,
        "x-default": canonical,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type,
      locale: "en_AE",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function buildCarTitle(car: Pick<Tables<"cars">, "year" | "brand" | "model" | "title">) {
  return `${car.year} ${car.brand} ${car.model} for Sale in the UAE`;
}

export function buildCarDescription(
  car: Pick<Tables<"cars">, "price" | "km_driven" | "location" | "fuel_type" | "transmission" | "description">
) {
  const summary = `${car.price.toLocaleString("en-AE")} AED · ${car.km_driven.toLocaleString("en-AE")} km · ${capitalize(car.fuel_type)} · ${capitalize(car.transmission)} · ${car.location}`;
  const details = car.description?.trim();

  if (!details) {
    return `View this verified used car on Wheels2Deals. ${summary}.`;
  }

  return `${summary}. ${truncate(details, 130)}`;
}

export function truncate(text: string, limit: number) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
