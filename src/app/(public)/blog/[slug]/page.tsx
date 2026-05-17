"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug, BLOGS } from "@/data/blogs";
import { absoluteUrl } from "@/lib/seo";
import { LandingNav } from "@/components/landing/LandingNav";
import { FooterSection } from "@/components/landing/FooterSection";
import { 
  ArrowLeft, Calendar, User, Clock, 
  Share2, Link2, MessageCircle,
  ChevronRight, ArrowRight, Check
} from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = getBlogBySlug(slug);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleShare = (type: 'email' | 'copy' | 'native') => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = blog?.title || "Check out this article on Wheels2Deals";

    if (type === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (type === 'native') {
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => {
          navigator.clipboard.writeText(url);
        });
      } else {
        navigator.clipboard.writeText(url);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#2A3510] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post not found</h1>
          <Link href="/" className="text-[#C9A84C] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-page-bg)] selection:bg-[#C9A84C] selection:text-[#2A3510]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blog.title,
            description: blog.description,
            image: blog.image.startsWith("http") ? blog.image : absoluteUrl(blog.image),
            author: {
              "@type": "Organization",
              name: "Wheels2Deals",
            },
            publisher: {
              "@type": "Organization",
              name: "Wheels2Deals",
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/circle_logo.png"),
              },
            },
            mainEntityOfPage: absoluteUrl(`/blog/${blog.slug}`),
            datePublished: "2026-05-12",
            dateModified: "2026-05-12",
            articleSection: blog.category,
          }),
        }}
      />
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-[#C9A84C] z-[110] transition-all duration-100"
        style={{ width: `${readingProgress}%` }}
      />

      <LandingNav />

      {/* Editorial Hero */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-[#2A3510]">
        <div className="absolute inset-0 z-0">
          <img 
            src={blog.image} 
            className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-[10s] ease-linear"
            alt={blog.alt}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 flex flex-col justify-end pb-20 md:pb-32">
          <Link 
            href="/"
            className="group inline-flex items-center gap-2 text-[#C9A84C] font-bold uppercase tracking-[0.2em] text-[11px] mb-12 hover:gap-4 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Insights
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest">
                {blog.category}
              </span>
              <div className="flex items-center gap-2 text-white/60 text-[13px] font-medium">
                <Calendar className="w-4 h-4" /> May 12, 2026
              </div>
              <div className="flex items-center gap-2 text-white/60 text-[13px] font-medium">
                <Clock className="w-4 h-4" /> {blog.readTime}
              </div>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-[clamp(32px,5vw,72px)] font-bold text-white leading-[1.1] tracking-tight mb-8">
              {blog.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="relative z-20 -mt-10 md:-mt-20 px-6 pb-32">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1fr_300px] gap-20">
          
          {/* Main Body */}
          <div className="bg-white rounded-[40px] p-8 md:p-16 lg:p-24 shadow-2xl border border-black/[0.03]">
             <div className="prose prose-xl prose-stone max-w-none font-[family-name:var(--font-body)]">
                <div className="text-black/70 text-lg md:text-xl leading-relaxed whitespace-pre-line">
                   {blog.content}
                </div>
             </div>

             {/* Bottom Social Share */}
             <div className="mt-24 pt-12 border-t border-black/5 flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-black/40">Share this article</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShare('copy')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                        copied ? 'bg-[#C9A84C] text-[#2A3510]' : 'bg-black/5 text-[#2A3510] hover:bg-[#2A3510] hover:text-white'
                      }`}
                      title="Copy Link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleShare('native')}
                      className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#2A3510] hover:bg-[#2A3510] hover:text-white transition-all duration-300"
                      title="More Sharing Options"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                   {["Automotive", "UAE", "Luxury", "Future"].map(tag => (
                     <span key={tag} className="px-3 py-1 bg-black/5 rounded-lg text-[12px] font-medium text-black/60">#{tag}</span>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-12">
             {/* WhatsApp Direct Chat */}
             <div className="bg-[#2A3510] p-8 rounded-[32px] text-white relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A84C]/10 rounded-full blur-3xl group-hover:bg-[#C9A84C]/20 transition-colors" />
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#C9A84C] mb-6">
                   <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4">Need Expert Advice?</h3>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                  Have questions about this article or a specific car? Chat directly with our automotive specialists for instant support.
                </p>
                <a 
                  href="https://wa.me/971000000000" 
                  target="_blank"
                  className="flex items-center justify-center gap-3 w-full bg-[#C9A84C] text-[#2A3510] font-bold py-4 rounded-xl text-[13px] uppercase tracking-widest hover:scale-[1.02] transition-transform"
                >
                   Chat with an Expert
                </a>
             </div>

             {/* Featured Car CTA */}
             <div className="relative group rounded-[32px] overflow-hidden aspect-[3/4] bg-[#2A3510]">
                <img 
                  src="/blue_car_hero.webp" 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                  alt="Featured Wheels2Deals car listing"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A3510] to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                   <p className="text-[#C9A84C] font-bold text-[10px] uppercase tracking-widest mb-2">Featured Listing</p>
                   <h4 className="text-white font-[family-name:var(--font-display)] text-xl font-bold mb-4">Looking for your next drive?</h4>
                   <Link 
                    href="/buy" 
                    className="inline-flex items-center gap-2 bg-white text-[#2A3510] px-4 py-2 rounded-lg text-[12px] font-bold"
                   >
                    Browse Cars <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-32 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-[#2A3510]">
              Keep <span className="italic font-light text-[#C9A84C]">reading.</span>
            </h2>
            <Link href="/" className="text-[#C9A84C] font-bold uppercase tracking-widest text-[13px] hover:gap-4 flex items-center gap-2 transition-all">
              View all insights <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {BLOGS.filter(b => b.title !== blog.title).slice(0, 3).map((post, i) => {
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[16/10] bg-black/5 rounded-3xl mb-6 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={post.alt}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <span className="text-[#C9A84C] font-bold uppercase tracking-widest text-[10px] mb-3 block">
                    {post.category}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold text-[#2A3510] mb-3 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-black/50 text-sm leading-relaxed line-clamp-2">
                    {post.readTime} • Expert Insights
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
