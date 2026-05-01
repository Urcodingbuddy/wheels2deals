"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LandingColorShift() {
  useEffect(() => {
    const root = document.getElementById("page-root");
    if (!root) return;

    const ctx = gsap.context(() => {
      // White → black: fires when the top of JourneySection ("Find the key…") hits the viewport.
      // Time-based so the transition is always 2.8s regardless of scroll speed.
      ScrollTrigger.create({
        trigger: "#journey-section",
        start: "top 80%",
        onEnter: () =>
          gsap.to(root, {
            backgroundColor: "#000000",
            duration: 2.8,
            ease: "power4.inOut",
          }),
        onLeaveBack: () =>
          gsap.to(root, {
            backgroundColor: "#ffffff",
            duration: 2.2,
            ease: "power4.inOut",
          }),
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
