import type { Metadata } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wheels2Deals — UAE Car Broker",
  description: "The smartest bridge between every car deal in the UAE. Free for buyers and sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={
        {
          "--font-display": "Georgia, 'Times New Roman', serif",
          "--font-body": "Arial, Helvetica, sans-serif",
        } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <body className="antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
