"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** How many yPercent units to travel total (default 10 = -5 to +5 of element height) */
  strength?: number;
}

export function ParallaxImage({ src, alt, className = "", strength = 10 }: ParallaxImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Derive scale from strength so there's always just enough buffer (no empty edges)
    const scale = 1 + (strength / 100) * 2 + 0.05;

    const ctx = gsap.context(() => {
      gsap.set(img, { scale });

      gsap.fromTo(
        img,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement ?? img,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [strength]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`w-full h-full object-cover will-change-transform ${className}`}
    />
  );
}
