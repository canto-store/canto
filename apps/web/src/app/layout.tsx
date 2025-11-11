import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { cn } from "@/lib/utils";
import { FontPreloader } from "@/components/font-preloader";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const opticianSans = localFont({
  src: "../../public/fonts/Optician-Sans.woff2",
  variable: "--font-optician-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Canto",
    default: "Canto",
  },
  description:
    "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
  keywords: [
    "marketplace",
    "online shopping",
    "ecommerce",
    "products",
    "canto",
  ],
  authors: [{ name: "Canto Team" }],
  creator: "Canto",
  publisher: "Canto",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://canto-store.com",
  ),
  openGraph: {
    type: "website",
    siteName: "Canto",
    title: "Canto - Egyptian Marketplace",
    description:
      "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Canto Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Canto - Egyptian Marketplace",
    description:
      "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
    images: ["/icon-512.png"],
  },
  alternates: {
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
  appleWebApp: {
    capable: true,
    title: "Canto",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <FontPreloader />
        <script
          async
          src="https://unpkg.com/pwacompat"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={cn(
          "bg-background font-sans antialiased",
          spaceGrotesk.variable,
          opticianSans.variable,
          ibmPlexSansArabic.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
