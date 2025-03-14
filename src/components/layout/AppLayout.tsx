"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoBanner } from "@/components/common/PromoBanner";
import { InstallPWA } from "@/components/pwa";
import { cn } from "@/lib/utils";
import { useBanner } from "@/providers";
import { MobileBottomNavigation } from "@/components/navigation/MobileBottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  theme?: "default" | "custom";
}

export function AppLayout({
  children,
  className = "",
  theme = "default",
}: AppLayoutProps) {
  const { showBanner } = useBanner();

  // Theme-based styling
  const bgColor = theme === "default" ? "" : "bg-[var(--color-background)]";
  const textColor =
    theme === "default" ? "text-black" : "text-[var(--color-primary)]";

  return (
    <div className={cn("min-h-screen", bgColor, textColor)}>
      {/* Banner - visible by default on each page load/refresh */}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 h-8 transition-all duration-300 md:h-10",
          showBanner
            ? "translate-y-0"
            : "pointer-events-none -translate-y-full opacity-0",
        )}
      >
        <PromoBanner />
      </div>
      {/* Header with dynamic positioning based on banner visibility */}
      <Header
        className={cn(
          "fixed right-0 left-0 z-40 transition-all duration-300",
          showBanner ? "top-8 md:top-10" : "top-0",
        )}
      />
      {/* Main content with dynamic padding based on CSS variables */}
      <main
        className={cn(
          "transition-all duration-300",
          "pt-[var(--header-height)]", // Use CSS variable for top padding
          "pb-16 md:pb-0", // Explicit padding for mobile to avoid layout shift
          className,
        )}
        style={{
          minHeight: "var(--main-height)", // Use CSS variable for min-height
        }}
      >
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
      <InstallPWA variant="message" />
      <MobileBottomNavigation />
    </div>
  );
}
