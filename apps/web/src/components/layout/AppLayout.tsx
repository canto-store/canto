"use client";

import { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InstallPWA } from "@/components/pwa";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    let isPWA = false;
    if (typeof window !== "undefined") {
      if ("matchMedia" in window) {
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        isPWA = mediaQuery.matches;
      }

      if (navigator.standalone) {
        isPWA = true;
      }
    }

    setIsStandalone(isPWA);
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto mb-10 space-y-10 px-4 md:space-y-20">
        {children}
      </main>
      <Footer />
      {isStandalone && <MobileBottomNavigation />}
      <InstallPWA variant="message" displayDelay={8 * 1000} />
      {/* <PromoModal displayDelay={2 * 1000} /> */}
    </>
  );
}
