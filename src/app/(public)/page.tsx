"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";

const HERO_WEBM =
  "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero.webm";
const HERO_MP4 =
  "https://hxkwxyypkbzxahteqzxv.supabase.co/storage/v1/object/public/car-videos/hero.mp4";

const PILLARS = [
  {
    num: "01",
    title: "Curated",
    body: "Every car is hand-selected. If it doesn't meet our standards, it doesn't meet you.",
  },
  {
    num: "02",
    title: "Verified",
    body: "Full service history, vehicle inspection, and mechanical warranty — included, not optional.",
  },
  {
    num: "03",
    title: "Transparent",
    body: "One price. No negotiation theatre. No hidden charges. The number you see is the number you pay.",
  },
];

const FEATURED = [
  {
    make: "Porsche",
    model: "Taycan 4S",
    year: "2023",
    km: "18,400 km",
    price: "₹1.24 Cr",
    status: "Available",
    statusColor: "#22C55E",
    bg: "#141414",
  },
  {
    make: "BMW",
    model: "M5 Competition",
    year: "2022",
    km: "32,000 km",
    price: "₹1.05 Cr",
    status: "Reserved",
    statusColor: "#F59E0B",
    bg: "#111111",
  },
  {
    make: "Mercedes",
    model: "AMG GT 63 S",
    year: "2023",
    km: "11,200 km",
    price: "₹2.40 Cr",
    status: "Available",
    statusColor: "#22C55E",
    bg: "#141414",
  },
];

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{ background: "#080808", color: "#ffffff", overflowX: "hidden" }}
    >
      <LandingNav />

      {/* ════════════════════════════════════════
          HERO — full screen video
      ════════════════════════════════════════ */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          minHeight: 600,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: "scale(1.3)",
          }}
        >
          <source src={HERO_WEBM} type="video/webm" />
          <source src={HERO_MP4} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,8,8,0.5)",
          }}
        />

        {/* Bottom gradient fade into page */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background:
              "linear-gradient(to top, #080808 0%, rgba(8,8,8,0) 100%)",
          }}
        />

        {/* Hero content — centered, slightly below midpoint */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "100%",
            padding: "0 24px",
            zIndex: 2,
          }}
        >
          {/* Eyebrow */}
          <p
            className="hero-enter hero-enter-delay-1"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#1A6B3C",
              marginBottom: 32,
            }}
          >
            Premium Pre-Owned &nbsp;·&nbsp; UAE
          </p>

          {/* Headline */}
          <h1
            className="hero-enter hero-enter-delay-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 96px)",
              fontWeight: 800,
              textTransform: "uppercase",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              marginBottom: 28,
            }}
          >
            Driven
            <br />
            By
            <br />
            <span style={{ color: "rgba(255,255,255,0.22)" }}>Legends.</span>
          </h1>

          {/* Supporting line */}
          <p
            className="hero-enter hero-enter-delay-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              fontWeight: 400,
              color: "#AAAAAA",
              maxWidth: 380,
              margin: "0 auto 44px",
              lineHeight: 1.65,
            }}
          >
            Curated supercars and luxury machines, personally verified. No
            surprises. No haggling.
          </p>

          {/* Pill CTA */}
          <div className="hero-enter hero-enter-delay-4">
            <Link
              href="/inventory"
              className="hero-cta"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#ffffff",
                border: "1.5px solid rgba(255,255,255,0.45)",
                borderRadius: 9999,
                padding: "14px 52px",
                textDecoration: "none",
              }}
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 8,
            }}
          >
            Scroll
          </span>
          <div className="scroll-indicator" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          MANIFESTO — brand statement
      ════════════════════════════════════════ */}
      <section
        style={{
          padding: "120px 40px",
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div className="reveal">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#1A6B3C",
                marginBottom: 24,
              }}
            >
              Our Philosophy
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3vw, 46px)",
                fontWeight: 800,
                textTransform: "uppercase",
                lineHeight: 0.95,
                color: "#ffffff",
              }}
            >
              Not just
              <br />
              cars.
              <br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>Stories.</span>
            </h2>
          </div>

          <div className="reveal reveal-delay-2">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(16px, 1.5vw, 20px)",
                fontWeight: 400,
                color: "#AAAAAA",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Every car in our showroom has a history worth knowing and a future
              worth owning. We don&apos;t push inventory — we place vehicles
              with people who understand them.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px, 1.3vw, 18px)",
                fontWeight: 400,
                color: "#666666",
                lineHeight: 1.75,
              }}
            >
              We&apos;re a single-location premium dealer, not a marketplace.
              That means every car is personally inspected, every claim is
              verified, and every enquiry gets a real person on the other end.
            </p>
          </div>
        </div>

        {/* Thin divider */}
        <div
          className="reveal reveal-delay-3"
          style={{
            marginTop: 100,
            height: 1,
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </section>

      {/* ════════════════════════════════════════
          PILLARS — three columns
      ════════════════════════════════════════ */}
      <section
        style={{ padding: "0 40px 120px", maxWidth: 1160, margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
          }}
        >
          {PILLARS.map((p, i) => (
            <div
              key={p.num}
              className={`reveal reveal-delay-${i + 1}`}
              style={{
                padding: "48px 40px",
                borderLeft:
                  i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                className="pillar-num"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1A6B3C",
                  letterSpacing: "0.08em",
                  marginBottom: 28,
                }}
              >
                {p.num}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#666666",
                  lineHeight: 1.7,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED — in the showroom
      ════════════════════════════════════════ */}
      <section style={{ padding: "100px 40px", background: "#080808" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {/* Section header */}
          <div
            className="reveal"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 56,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#1A6B3C",
                  marginBottom: 12,
                }}
              >
                In the showroom
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                Now Available
              </h2>
            </div>
            <Link
              href="/inventory"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: 4,
                transition: "color 0.2s ease-out",
              }}
            >
              View All →
            </Link>
          </div>

          {/* Car cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {FEATURED.map((car, i) => (
              <article
                key={car.model}
                className={`reveal reveal-delay-${i + 1} img-zoom-wrap`}
                style={{
                  background: car.bg,
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition:
                    "border-color 0.25s ease-out, box-shadow 0.25s ease-out",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.14)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Image placeholder */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/9",
                    background: "#1a1a1a",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="img-zoom"
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      inset: 0,
                      background: "#1a1a1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#2a2a2a",
                      }}
                    >
                      Photo
                    </span>
                  </div>

                  {/* Status badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: `rgba(${car.statusColor === "#22C55E" ? "34,197,94" : "245,158,11"},0.12)`,
                      border: `1px solid rgba(${car.statusColor === "#22C55E" ? "34,197,94" : "245,158,11"},0.25)`,
                      borderRadius: 9999,
                      padding: "4px 10px",
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: car.statusColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: car.statusColor,
                      }}
                    >
                      {car.status}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: 20 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#666666",
                      marginBottom: 4,
                    }}
                  >
                    {car.make}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#ffffff",
                      lineHeight: 1.05,
                      marginBottom: 12,
                    }}
                  >
                    {car.model}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 12,
                      color: "#555555",
                      marginBottom: 16,
                    }}
                  >
                    {car.year}&nbsp;&nbsp;·&nbsp;&nbsp;{car.km}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 16,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1A6B3C",
                        textTransform: "uppercase",
                      }}
                    >
                      {car.price}
                    </span>
                    <Link
                      href="/inventory"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#ffffff",
                        background: "#0F0F0F",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 4,
                        padding: "8px 16px",
                        textDecoration: "none",
                        transition: "background 0.15s ease-out",
                      }}
                    >
                      View Car
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS — trust numbers
      ════════════════════════════════════════ */}
      <section
        style={{
          padding: "100px 40px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
          }}
        >
          {[
            { num: "150+", label: "Cars Sold" },
            { num: "100%", label: "Verified Vehicles" },
            { num: "5 Yrs", label: "In Business" },
            { num: "4.9★", label: "Customer Rating" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`reveal reveal-delay-${i + 1}`}
              style={{
                textAlign: "center",
                padding: "20px 32px",
                borderRight:
                  i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#ffffff",
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {stat.num}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#444444",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BAND — bottom call to action
      ════════════════════════════════════════ */}
      <section
        style={{
          padding: "140px 40px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p
            className="reveal"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#1A6B3C",
              marginBottom: 24,
            }}
          >
            Ready to Find Yours?
          </p>
          <h2
            className="reveal reveal-delay-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5.5vw, 72px)",
              fontWeight: 800,
              textTransform: "uppercase",
              lineHeight: 0.92,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: 36,
            }}
          >
            Find Your
            <br />
            <span style={{ color: "rgba(255,255,255,0.18)" }}>Next Car.</span>
          </h2>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              fontWeight: 400,
              color: "#555555",
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            Browse our current inventory or get in touch — we&apos;ll help you
            find exactly what you&apos;re looking for.
          </p>
          <div
            className="reveal reveal-delay-3"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/inventory"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "#0F0F0F",
                background: "#ffffff",
                border: "none",
                borderRadius: 4,
                padding: "14px 36px",
                textDecoration: "none",
                transition: "background 0.15s ease-out",
              }}
            >
              Browse Inventory
            </Link>
            <Link
              href="/contact"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "#ffffff",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.18)",
                borderRadius: 4,
                padding: "14px 36px",
                textDecoration: "none",
                transition: "border-color 0.15s ease-out",
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER — minimal
      ════════════════════════════════════════ */}
      <footer
        style={{
          padding: "40px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1160,
          margin: "0 auto",
        }}
      >
        <img
          src="/logo.svg"
          alt="wheels2deals"
          style={{
            height: 20,
            filter: "brightness(0) invert(1)",
            opacity: 0.3,
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "#333333",
            letterSpacing: "0.08em",
          }}
        >
          © 2026 wheels2deals. UAE, India.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                color: "#333333",
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
