import type { MetadataRoute } from "next";
import { BLOGS } from "@/data/blogs";
import { createClient } from "@/lib/server";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/buy"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: absoluteUrl("/sell"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: absoluteUrl("/how-it-works"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/buying"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/selling"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/inspection-and-transfer"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/insurance"), lastModified: now, changeFrequency: "monthly", priority: 0.68 },
    { url: absoluteUrl("/finance"), lastModified: now, changeFrequency: "monthly", priority: 0.68 },
    { url: absoluteUrl("/detailing"), lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOGS.map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  let carPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const { data: cars } = await supabase
      .from("cars")
      .select("slug, updated_at")
      .eq("status", "available");

    carPages = (cars ?? []).map((car) => ({
      url: absoluteUrl(`/buy/${car.slug}`),
      lastModified: car.updated_at ? new Date(car.updated_at) : now,
      changeFrequency: "daily",
      priority: 0.85,
    }));
  } catch {
    carPages = [];
  }

  return [...staticPages, ...blogPages, ...carPages];
}
