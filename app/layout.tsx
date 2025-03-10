import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";

// Load IBM Plex Sans Arabic from Google Fonts
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Load Optician Sans from local font file
const opticianSans = localFont({
  src: "../public/fonts/Optician-Sans.woff2",
  variable: "--font-optician-sans",
  display: "swap",
});

// Load Space Grotesk from local font file
const spaceGrotesk = localFont({
  src: "../public/fonts/SpaceGrotesk.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Canto",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${opticianSans.variable} ${ibmPlexSansArabic.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
