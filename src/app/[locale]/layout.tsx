import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { Providers } from "@/providers";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const opticianSans = localFont({
  src: "../../../public/fonts/Optician-Sans.woff2",
  variable: "--font-optician-sans",
  display: "swap",
  preload: true,
});

const spaceGrotesk = localFont({
  src: "../../../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
});

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://canto.com"),
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
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: "en" | "ar";
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const paramsObj = await params;
  const { locale } = paramsObj;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  const localeClass = locale === "ar" ? "font-arabic" : "font-latin";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* iOS PWA meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS splash screens - explicit links for better compatibility */}
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1668-2388.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1536-2048.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1125-2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1242-2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-828-1792.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-750-1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1242-2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        {/* Apple touch icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/apple-touch-icon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon-120x120.png"
        />

        {/* Always include the HMR fix script - it will self-determine if it needs to run */}
        {process.env.NODE_ENV !== "production" && (
          <Script src="/hmr-fix.js" strategy="beforeInteractive" id="hmr-fix" />
        )}

        {/* Script to show recovery link if needed */}
        <Script id="recovery-link-script" strategy="lazyOnload">
          {`
            // Check if there have been service worker failures
            if (typeof window !== 'undefined') {
              window.addEventListener('load', () => {
                const swFailureCount = parseInt(localStorage.getItem("sw_failure_count") || "0");
                if (swFailureCount > 0) {
                  // Show the recovery link
                  const recoveryLink = document.getElementById('recovery-link');
                  if (recoveryLink) {
                    recoveryLink.style.display = 'flex';
                  }
                }
              });
            }
          `}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${opticianSans.variable} ${ibmPlexSansArabic.variable} antialiased ${localeClass}`}
      >
        {/* Recovery link - hidden by default */}
        <a
          href="/recovery.html"
          id="recovery-link"
          style={{
            display: "none",
            position: "fixed",
            bottom: "10px",
            left: "10px",
            zIndex: 9999,
            backgroundColor: "#2563eb",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            textDecoration: "none",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Fix App Issues
        </a>

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>

        {/* Service worker registration script - moved to end of body for better compatibility */}
        <Script src="/register-sw.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
