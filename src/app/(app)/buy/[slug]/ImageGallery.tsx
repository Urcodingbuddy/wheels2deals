"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-[#F3F1EC] border border-[#E8E4DE] flex items-center justify-center">
        <span className="font-[family-name:var(--font-body)] text-[13px] text-[#BBBBBB]">
          No images available
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[2/1] rounded-2xl overflow-hidden bg-[#F3F1EC] group">
        <img
          src={images[active]}
          alt={`${title} - photo ${active + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm border-none cursor-pointer"
            >
              <ChevronLeft size={16} className="text-[#2A3510]" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm border-none cursor-pointer"
            >
              <ChevronRight size={16} className="text-[#2A3510]" />
            </button>

            {/* Counter */}
            <span className="absolute bottom-3 right-3 font-[family-name:var(--font-body)] text-[11px] font-medium text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-[72px] h-[52px] rounded-lg overflow-hidden shrink-0 transition-all duration-150 border-2 cursor-pointer bg-transparent p-0 ${
                active === i
                  ? "border-[#3A4A20] shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-90 hover:border-[#3A4A20]/40"
              }`}
            >
              <img
                src={img}
                alt={`View ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
