import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/layout/AppLayout";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  const localeClass = locale === "ar" ? "font-arabic" : "font-latin";

  return (
    <body
      className={cn(
        "bg-background font-sans antialiased",
        spaceGrotesk.variable,
        opticianSans.variable,
        ibmPlexSansArabic.variable,
        localeClass,
      )}
      dir={dir}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Toaster />
      </NextIntlClientProvider>
    </body>
  );
}
