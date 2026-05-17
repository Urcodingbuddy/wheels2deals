import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@/lib/server";

export const alt = "Wheels2Deals car listing preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("brand, model, year, price, location, images, slug")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (!car) notFound();

  const logoBuffer = await readFile(join(process.cwd(), "public", "circle_logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  const heroImage = car.images[0] ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#14200D",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt={`${car.year} ${car.brand} ${car.model}`}
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(20,32,13,0.95) 0%, rgba(20,32,13,0.82) 45%, rgba(20,32,13,0.5) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "rgba(201,168,76,0.22)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "64px 72px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#C9A84C",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Wheels2Deals Verified Listing
            </div>
            <img src={logoSrc} alt="Wheels2Deals" width={100} height={100} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 760,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "rgba(255,255,255,0.72)",
                marginBottom: 18,
              }}
            >
              {car.year} · {car.brand} · {car.location}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 62,
                lineHeight: 1.05,
                fontWeight: 800,
                marginBottom: 24,
              }}
            >
              {car.brand} {car.model}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "14px 24px",
                  borderRadius: 999,
                  background: "#C9A84C",
                  color: "#17200B",
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                AED {car.price.toLocaleString("en-AE")}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: 24,
                }}
              >
                View full photos and enquiry details on Wheels2Deals
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
