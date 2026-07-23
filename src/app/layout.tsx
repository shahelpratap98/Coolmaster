import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./promos.css";
import { SiteChrome } from "@/components/SiteChrome";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.coolmaster.co.nz"),
  title: {
    default:
      "Commercial HVAC, Refrigeration & Heat Pump Specialists Auckland | CoolMaster",
    template: "%s | CoolMaster Services",
  },
  description:
    "Commercial HVAC, refrigeration and heat pump specialists in Auckland — expert installation, repairs, maintenance, BWoF servicing and Form 12A support. Next-day installation available, zero surprise pricing, Auckland since 2014. Request a free quote.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: "CoolMaster Services Limited",
    images: ["/coolmaster-share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/coolmaster-share.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#15224F",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NZ"
      className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
