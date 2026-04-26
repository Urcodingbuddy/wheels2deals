"use client";

import { useState } from "react";
import Link from "next/link";
import { X, User, ChevronRight } from "lucide-react";

/* ── Service groups ── */
const SERVICE_GROUPS = [
  {
    label: "Buy & Sell",
    items: [
      {
        label: "Buy a Car",
        href: "/buy",
        title: "Find Your Next Car",
        sub: "Guided buying, end to end",
      },
      {
        label: "Sell Your Car",
        href: "/sell",
        title: "Sell With Confidence",
        sub: "Best price, minimum effort",
      },
      {
        label: "Finance & Loans",
        href: "/finance",
        title: "Drive Now, Pay Smart",
        sub: "Flexible plans, trusted lenders",
      },
    ],
  },
  {
    label: "Vehicle Services",
    items: [
      {
        label: "Inspection",
        href: "/inspect",
        title: "Know What You're Buying",
        sub: "Certified, unbiased assessments",
      },
      {
        label: "Insurance",
        href: "/insurance",
        title: "Stay Protected",
        sub: "Right coverage, competitive rates",
      },
      {
        label: "Transfer & Renewals",
        href: "/transfer",
        title: "Paperwork, Handled",
        sub: "Passing, registration & ownership",
      },
    ],
  },
  {
    label: "Company",
    items: [
      {
        label: "About",
        href: "/about",
        title: "One Dealer. One Standard.",
        sub: "Our story and philosophy",
      },
      {
        label: "Contact",
        href: "/contact",
        title: "Let's Talk Cars",
        sub: "Reach our team, anytime",
      },
    ],
  },
];

type Item = (typeof SERVICE_GROUPS)[0]["items"][0];

const DEFAULT: Item = {
  label: "",
  href: "/",
  title: "Premium Pre-Owned",
  sub: "Curated cars. Verified quality. UAE.",
};

const PREVIEW_CARDS = [
  {
    tag: "Buy & Sell",
    title: "Your Deal,\nOur Expertise",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
    accent: "#1A6B3C",
  },
  {
    tag: "Vehicle Services",
    title: "Inspect.\nInsure. Transfer.",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop",
    accent: "#1A6B3C",
  },
  {
    tag: "Company",
    title: "One Standard.\nAlways.",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&auto=format&fit=crop",
    accent: "#1A6B3C",
  },
];

const LABEL: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
};

function TwoLineIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.5)}
      viewBox="0 0 30 15"
      fill="none"
      aria-hidden
    >
      <line
        x1="0"
        y1="2"
        x2="30"
        y2="2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1="13"
        x2="30"
        y2="13"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Item>(DEFAULT);

  const close = () => {
    setOpen(false);
    setActive(DEFAULT);
  };

  return (
    <>
      {/* ── Gradient vignette behind navbar ── */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,0.8) 0%, transparent 100%)",
          zIndex: 99,
          pointerEvents: "none",
        }}
      />

      {/* ── Navbar ── */}
      <header
        style={{
          position: "fixed",
          top: 40,
          left: 0,
          right: 0,
          height: 64,
          background: "transparent",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        {/* Left — 2-line hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border border-transparent transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md hover:border-white/15"
          style={{ background: "none" }}
        >
          <TwoLineIcon size={22} />
          <span style={LABEL}>Menu</span>
        </button>

        {/* Center — logo */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo.svg"
              alt="wheels2deals"
              style={{
                height: 45,
                width: "auto",
                filter: "brightness(0) invert(1)",
                display: "block",
              }}
            />
          </Link>
        </div>

        {/* Right — login */}
        <Link
          href="/login"
          aria-label="Account"
          className="flex items-center gap-2 no-underline px-3 py-2 rounded-lg border border-transparent transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md hover:border-white/15"
        >
          <span style={LABEL}>Login</span>
          <User size={20} color="#ffffff" strokeWidth={1.5} />
        </Link>
      </header>

      {/* ── Mega menu ── */}
      {open && (
        <>
          {/* Blurred backdrop */}
          <div
            className="menu-backdrop"
            onClick={close}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(8,8,8,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 150,
            }}
          />

          {/* White panel */}
          <div
            className="menu-panel"
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              bottom: 20,
              width: "min(936px, calc(100vw - 40px))",
              background: "#ffffff",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "24px 36px",
                borderBottom: "1px solid #EDEAE6",
              }}
            >
              <button
                onClick={close}
                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                style={{ background: "none", border: "none" }}
              >
                <X size={28} color="#0F0F0F" strokeWidth={1.5} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#999",
                  }}
                >
                  Close
                </span>
              </button>
            </div>

            {/* Panel body */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* ── Left nav rail ── */}
              <div
                className="no-scrollbar"
                style={{
                  flex: "0 0 38%",
                  padding: "36px 40px 40px",
                  overflowY: "auto",
                  borderRight: "1px solid #EDEAE6",
                }}
              >
                {(() => {
                  let idx = 0;
                  return SERVICE_GROUPS.map((group) => (
                    <div key={group.label} style={{ marginBottom: 36 }}>
                      <p
                        className="nav-item-anim"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 13,
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#C8981A",
                          marginBottom: 8,
                          animationDelay: `${idx++ * 0.06 + 0.15}s`,
                        }}
                      >
                        {group.label}
                      </p>

                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={close}
                          onMouseEnter={() => setActive(item)}
                          onMouseLeave={() => setActive(DEFAULT)}
                          className="menu-rail-link nav-item-anim"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "13px 0",
                            borderBottom: "1px solid #F2EFEb",
                            textDecoration: "none",
                            animationDelay: `${idx++ * 0.06 + 0.15}s`,
                          }}
                        >
                          <span
                            className="menu-rail-label"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: 21,
                              fontWeight: 800,
                              textTransform: "uppercase",
                              color: "#0F0F0F",
                              letterSpacing: "-0.01em",
                              lineHeight: 1,
                              transition: "color 0.2s ease-out",
                            }}
                          >
                            {item.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className="menu-rail-chevron"
                            color="#C8C4BE"
                            strokeWidth={1.5}
                          />
                        </Link>
                      ))}
                    </div>
                  ));
                })()}
              </div>

              {/* ── Right — three landscape cards ── */}
              <div
                className="no-scrollbar"
                style={{
                  flex: 1,
                  padding: "28px 28px 28px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  overflowY: "auto",
                }}
              >
                {PREVIEW_CARDS.map((card, i) => (
                  <div
                    key={card.tag}
                    className="nav-item-anim"
                    style={{
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 12,
                      backgroundImage: `url(${card.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "16px 20px",
                      animationDelay: `${0.2 + i * 0.1}s`,
                    }}
                  >
                    {/* Dark overlay for readability */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                      }}
                    />

                    {/* Bottom gradient */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "70%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                      }}
                    />

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: card.accent,
                          marginBottom: 6,
                        }}
                      >
                        {card.tag}
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(14px, 1.6vw, 20px)",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          color: "#ffffff",
                          lineHeight: 1.05,
                          letterSpacing: "-0.01em",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {card.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
