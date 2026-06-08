"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

type Props = { carTitle: string };

export default function ShareButton({ carTitle }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: carTitle,
      text: `Check out this ${carTitle} on Wheels2Deals`,
      url,
    };

    // Native share sheet (mobile / supported browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }

    // Clipboard fallback (desktop)
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this car"
      title={copied ? "Link copied" : "Share this car"}
      className="shrink-0 w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#3A4A20] hover:bg-[#2A3510] active:scale-[0.96] transition-all duration-150 cursor-pointer border-none"
    >
      {copied ? (
        <Check size={24} strokeWidth={2.2} className="text-white" />
      ) : (
        <Image
          src="/share-gold-icon.svg"
          alt="Share"
          width={24}
          height={24}
          className="brightness-0 invert"
        />
      )}
    </button>
  );
}
