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
});

const opticianSans = localFont({
  src: "../../public/fonts/Optician-Sans.woff2",
  variable: "--font-optician-sans",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canto",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canto",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        {/* Always include the HMR fix script - it will self-determine if it needs to run */}
        <Script src="/hmr-fix.js" strategy="beforeInteractive" id="hmr-fix" />

        {/* Always include the service worker registration script - it will self-determine if it should register */}
        <Script src="/register-sw.js" id="register-sw" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${opticianSans.variable} ${ibmPlexSansArabic.variable} antialiased ${localeClass}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
