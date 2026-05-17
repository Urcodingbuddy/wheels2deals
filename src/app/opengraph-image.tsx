import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/seo";

export const alt = "Wheels2Deals social preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(join(process.cwd(), "public", "circle_logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #17200B 0%, #2A3510 45%, #42551C 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(201,168,76,0.32), transparent 38%)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "72px 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 660,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: 28,
              }}
            >
              Wheels2Deals
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 70,
                lineHeight: 1,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              Buy & Sell Cars in the UAE
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Verified listings, free valuation, finance, insurance, and RTA support on one reliable platform.
            </div>
          </div>
          <div
            style={{
              width: 280,
              height: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 80px rgba(201,168,76,0.24)",
            }}
          >
            <img
              src={logoSrc}
              alt={siteConfig.name}
              width={220}
              height={220}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
