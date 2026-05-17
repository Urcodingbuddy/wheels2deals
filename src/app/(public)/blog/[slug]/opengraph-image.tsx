import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBlogBySlug } from "@/data/blogs";

export const alt = "Wheels2Deals blog preview";
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
  const blog = getBlogBySlug(slug);

  if (!blog) notFound();

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
            "linear-gradient(140deg, #17200B 0%, #213115 42%, #2A3510 100%)",
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
              "radial-gradient(circle at bottom left, rgba(201,168,76,0.28), transparent 34%)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "70px 76px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
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
                  marginBottom: 16,
                }}
              >
                Wheels2Deals Blog
              </div>
              <div
                style={{
                  display: "flex",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                {blog.category}
              </div>
            </div>
            <img
              src={logoSrc}
              alt="Wheels2Deals"
              width={110}
              height={110}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.05,
              fontWeight: 800,
              maxWidth: 980,
            }}
          >
            {blog.title}
          </div>
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
                maxWidth: 860,
                color: "rgba(255,255,255,0.76)",
                fontSize: 26,
                lineHeight: 1.4,
              }}
            >
              {blog.description}
            </div>
            <div
              style={{
                display: "flex",
                color: "#C9A84C",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {blog.readTime}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
