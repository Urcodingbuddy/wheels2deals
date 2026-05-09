"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
    });
    
    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    function onFrame(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(onFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route change scrolling
  useEffect(() => {
    if (!lenisRef.current) return;

    // Small delay to ensure the new page DOM is fully mounted and images are loaded
    const timeoutId = setTimeout(() => {
      const rawHash = window.location.hash;
      if (rawHash) {
        // Prevent ##services or similar bugs
        const cleanHash = rawHash.replace(/^#+/, '#');
        try {
          const target = document.querySelector(cleanHash) as HTMLElement;
          if (target) {
            // Offset slightly if there's a sticky header, or just scroll to the top of the element
            lenisRef.current?.scrollTo(target, { immediate: true, offset: 0 });
            return;
          }
        } catch (e) {
          // Ignore invalid selector errors
        }
      }
      
      // Default behavior: scroll to top if no hash or target not found
      lenisRef.current?.scrollTo(0, { immediate: true });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return <>{children}</>;
}
