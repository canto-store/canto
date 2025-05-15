import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - Canto",
    default: "Canto - Egyptian Marketplace",
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
        url: "/web-app-manifest-512x512.png",
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
    creator: "@cantomarketplace",
    images: ["/web-app-manifest-512x512.png"],
  },
  alternates: {
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canto",
    startupImage: [
      // iPad Pro
      {
        url: "/apple-splash-2048-2732.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1668-2388.png",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1536-2048.png",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },

      // iPhone 16 Series
      {
        url: "/apple-splash-1320-2868.png",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1206-2622.png",
        media:
          "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1179-2556.png",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },

      // iPhone 15 Series
      {
        url: "/apple-splash-1290-2796.png",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },

      // iPhone 14 Series
      {
        url: "/apple-splash-1284-2778.png",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1170-2532.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },

      // iPhone X through 13 Series
      {
        url: "/apple-splash-1125-2436.png",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1242-2688.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-828-1792.png",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },

      // Older iPhones
      {
        url: "/apple-splash-750-1334.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/apple-splash-1242-2208.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
    ],
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
  return <html>{children}</html>;
}
