"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import type { IconType } from "react-icons";

const PHONE = "971561498485";

function getMessage(pathname: string) {
  if (pathname === "/")
    return "Hi Wheels2Deals, I'm on your homepage and would like to learn more about your car services.";
  if (pathname === "/about")
    return "Hi Wheels2Deals, I'm reading about you and would like to know more about the team and the bridge model.";
  if (pathname === "/sell")
    return "Hi Wheels2Deals, I want to sell my car and would like a free valuation.";
  if (pathname === "/how-it-works")
    return "Hi Wheels2Deals, I have a question about how your process works.";
  if (pathname.startsWith("/buy/"))
    return `Hi Wheels2Deals, I'm interested in this specific car: ${pathname.split("/").pop()}.`;
  return "Hi Wheels2Deals, I'd like to inquire about your services.";
}

export function SocialRail() {
  const pathname = usePathname() ?? "/";

  // Tuck the rail away while the user is scrolling, then reveal it when idle
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => {
      setVisible(false);
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setVisible(true), 1200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Available on every page except admin routes
  if (pathname.startsWith("/admin")) return null;

  const links: {
    Icon: IconType;
    href: string;
    label: string;
    external?: boolean;
  }[] = [
    {
      Icon: FaWhatsapp,
      href: `https://wa.me/${PHONE}?text=${encodeURIComponent(getMessage(pathname))}`,
      label: "WhatsApp",
      external: true,
    },
    {
      Icon: FaInstagram,
      href: "https://www.instagram.com/wheels2dealss/",
      label: "Instagram",
      external: true,
    },
    {
      Icon: FaFacebookF,
      href: "https://www.facebook.com/people/Wheels2Deals/100052648911178/",
      label: "Facebook",
      external: true,
    },
  ];

  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-[90] transition-all duration-500 ease-out ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="relative flex flex-col items-end gap-px rounded-l-xl sm:rounded-l-2xl border border-r-0 border-[#C9A84C]/25 bg-[#2A3510]/95 backdrop-blur-md p-1 sm:p-1.5 shadow-[-8px_8px_28px_rgba(42,53,16,0.28)]">
        {/* Concave slope easing the rail into the screen edge — top */}
        <span
          className="pointer-events-none absolute right-0 bottom-full h-3.5 w-2.5 sm:h-4 sm:w-3"
          style={{
            background:
              "radial-gradient(10px 16px at top left, transparent 99.2%, rgba(42,53,16,0.95) 100%)",
          }}
        />
        {/* Concave slope easing the rail into the screen edge — bottom */}
        <span
          className="pointer-events-none absolute right-0 top-full h-3.5 w-2.5 sm:h-4 sm:w-3"
          style={{
            background:
              "radial-gradient(10px 16px at bottom left, transparent 99.2%, rgba(42,53,16,0.95) 100%)",
          }}
        />
        {links.map(({ Icon, href, label, external }) => (
          <a
            key={label}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener nofollow" }
              : {})}
            aria-label={label}
            className="group/icon relative flex items-center justify-center"
          >
            {/* Sliding label */}
            <span className="pointer-events-none absolute right-[calc(100%+8px)] whitespace-nowrap rounded-full bg-[#2A3510] px-3 py-1.5 font-[family-name:var(--font-body)] text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C] border border-[#C9A84C]/25 opacity-0 translate-x-2 transition-all duration-300 group-hover/icon:opacity-100 group-hover/icon:translate-x-0">
              {label}
            </span>

            <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl text-[#C9A84C] transition-all duration-300 group-hover/icon:bg-[#C9A84C] group-hover/icon:text-[#2A3510] group-hover/icon:scale-105">
              <Icon className="h-4 w-4 sm:h-[19px] sm:w-[19px]" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
