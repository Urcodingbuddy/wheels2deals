"use client";

import { useState } from "react";

const BLOGS = [
  {
    category: "Buying Guide",
    title: "How to Spot a Flood-Damaged Car Before You Buy",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Market Trends",
    title: "UAE's Most In-Demand Cars of 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Finance",
    title: "Car Loans in the UAE: Everything You Need to Know",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Selling Tips",
    title: "10 Tricks That Get You a Higher Price for Your Car",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Electric Vehicles",
    title: "Is the UAE Ready for an EV Revolution?",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Insurance",
    title: "Third-Party vs Comprehensive: Which Cover Do You Need?",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Ownership",
    title: "RTA Transfer Process Explained Step by Step",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Luxury",
    title: "Inside the UAE's Booming Pre-Owned Supercar Market",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
  },
  {
    category: "Inspection",
    title: "What Happens During a Pre-Purchase Car Inspection?",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop",
  },
];

// Per-slot values indexed 0 (far-left) → 6 (far-right); slots ±3 are off-screen buffers
const SCALES = [0.5, 0.62, 0.78, 1.0, 0.78, 0.62, 0.5];
const OPACITIES = [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0];
const SLOT_GAP = 268; // px between card centres

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function BlogsCarousel() {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const total = BLOGS.length;

  function getPos(idx: number): number {
    let p = mod(idx - active, total);
    if (p > Math.floor(total / 2)) p -= total;
    return p;
  }

  const prev = () => setActive((a) => mod(a - 1, total));
  const next = () => setActive((a) => mod(a + 1, total));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe distance of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    setTouchStart(null);
  };

  return (
    <div 
      className="select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track */}
      <div className="relative h-[430px] overflow-hidden">
        {BLOGS.map((blog, idx) => {
          const pos = getPos(idx);
          if (Math.abs(pos) > 3) return null;

          const si = pos + 3;
          const scale = SCALES[si];
          const opacity = OPACITIES[si];
          const xOffset = pos * SLOT_GAP;
          const zIndex = 5 - Math.abs(pos);
          const isActive = pos === 0;

          return (
            <div
              key={blog.title}
              onClick={() => !isActive && setActive(idx)}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "270px",
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) scale(${scale})`,
                opacity,
                zIndex,
                transition:
                  "transform 0.58s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.58s ease",
                cursor: isActive ? "default" : "pointer",
                pointerEvents: Math.abs(pos) >= 3 ? "none" : "auto",
              }}
            >
              {/* Card */}
              <div className="relative h-[390px] rounded-2xl overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-[family-name:var(--font-body)] text-[9.5px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] mb-1">
                    {blog.category}
                  </p>
                  <h3 className="font-[family-name:var(--font-display)] text-[18px] font-semibold text-white leading-[1.25] tracking-[-0.01em] mb-2">
                    {blog.title}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[12px] font-medium text-white/50">
                    {blog.readTime}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-10">
        <button
          onClick={prev}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2A3510]/20 bg-transparent text-[#2A3510]/40 transition-all duration-200 hover:border-[#2A3510] hover:text-[#2A3510]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-[7px]">
          {BLOGS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="cursor-pointer rounded-full border-none bg-transparent p-0 transition-all duration-300"
              style={{
                width: active === i ? "22px" : "6px",
                height: "6px",
                backgroundColor:
                  active === i ? "#2A3510" : "rgba(42,53,16,0.2)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2A3510]/20 bg-transparent text-[#2A3510]/40 transition-all duration-200 hover:border-[#2A3510] hover:text-[#2A3510]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
