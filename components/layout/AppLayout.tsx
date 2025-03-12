"use client";

import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoBanner } from "@/components/common/PromoBanner";
import { InstallPWA } from "@/components/pwa";
import { cn } from "@/lib/utils";
import { useBanner } from "@/lib/context";

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
  const { showBanner, isLoading } = useBanner();

  // Theme-based styling
  const bgColor =
    theme === "default" ? "bg-white" : "bg-[var(--color-background)]";
  const textColor =
    theme === "default" ? "text-black" : "text-[var(--color-primary)]";

  // Calculate the padding top based on banner visibility
  // Header height is 4.5rem (h-18), banner height is 2.5rem (h-10)

  // Don't render the banner during loading to prevent flash
  const shouldRenderBanner = !isLoading && showBanner;

  // Update CSS variables when banner visibility changes
  useEffect(() => {
    const updateHeaderHeight = () => {
      const root = document.documentElement;
      const isMobile = window.innerWidth < 768;
      let headerHeight;

      if (shouldRenderBanner) {
        headerHeight = isMobile ? "6rem" : "7rem";
      } else {
        headerHeight = isMobile ? "4rem" : "4.5rem";
      }

      root.style.setProperty("--header-height", headerHeight);
      root.style.setProperty("--main-height", `calc(100vh - ${headerHeight})`);
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [shouldRenderBanner]);

  return (
    <div className={cn("min-h-screen", bgColor, textColor)}>
      {/* Banner - visible by default on each page load/refresh */}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 h-8 transition-all duration-300 md:h-10",
          shouldRenderBanner
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
          shouldRenderBanner ? "top-8 md:top-10" : "top-0",
        )}
      />
      {/* Main content with dynamic padding based on banner visibility */}
      <main
        className={cn(
          "transition-all duration-300",
          shouldRenderBanner ? "pt-24 md:pt-28" : "pt-16 md:pt-[4.5rem]",
          className,
        )}
      >
        <div className="container mx-auto px-4">{children}</div>
      </main>
      <Footer />
      <InstallPWA variant="message" />
    </div>
  );
}
