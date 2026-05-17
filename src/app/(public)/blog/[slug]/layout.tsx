import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOGS, getBlogBySlug } from "@/data/blogs";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return BLOGS.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) notFound();

  return buildPageMetadata({
    title: blog.title,
    description: blog.description,
    path: `/blog/${blog.slug}`,
    keywords: [
      `${blog.category} UAE`,
      "Wheels2Deals blog",
      "UAE car buying advice",
      "UAE car selling advice",
    ],
    image: absoluteUrl(`/blog/${blog.slug}/opengraph-image`),
    type: "article",
  });
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
