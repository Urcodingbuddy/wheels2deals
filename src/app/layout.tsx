import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { WhatsAppSticky } from "@/components/shared/WhatsAppSticky";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wheels2Deals - UAE Car Broker",
  description: "Built on Trust Every Leading Brand. One Reliable Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <SmoothScrollProvider>
          {children}
          <WhatsAppSticky />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
