import { forwardRef } from "react";
import Link from "next/link";
import { ParallaxImage } from "@/components/ParallaxImage";

export const BannerCursorImage = forwardRef<HTMLDivElement>(
  function BannerCursorImage(_, imageRef) {
    return (
      <Link
        href="/inventory"
        className="w-full md:w-[55%] relative min-h-[420px] md:min-h-[auto] overflow-hidden block cursor-none"
      >
        <div ref={imageRef} className="absolute inset-0">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop"
            alt="Premium Dealership"
            className="absolute inset-0"
            strength={2}
          />
        </div>
      </Link>
    );
  }
);
