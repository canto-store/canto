import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

// Load IBM Plex Sans Arabic from Google Fonts
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Load Optician Sans from local font file
const opticianSans = localFont({
  src: "../../public/fonts/Optician-Sans.woff2",
  variable: "--font-optician-sans",
  display: "swap",
});

// Load Space Grotesk from local font file
const spaceGrotesk = localFont({
  src: "../../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canto",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  const paramsObj = await params;
  const { locale } = paramsObj;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  // Determine text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Use the appropriate font class based on locale
  const localeClass = locale === "ar" ? "font-arabic" : "font-latin";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${opticianSans.variable} ${ibmPlexSansArabic.variable} antialiased ${localeClass}`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
