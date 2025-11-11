"use client";

import "@khmyznikov/pwa-install";
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { useIsInstalled } from "@/hooks/useIsInstalled";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isInstalled = useIsInstalled();
  return (
    <>
      <pwa-install
        name="Canto App"
        icon="/logo-192.png"
        disable-install-description="true"
        disable-screenshots="true"
        description="Egyptian Marketplace"
        manual-apple="true"
        manual-chrome="true"
      ></pwa-install>
      <Header />
      <main className="container mx-auto mb-10 space-y-10 px-4 md:space-y-20">
        {children}
      </main>
      <Footer />
      {isInstalled && <MobileBottomNavigation />}
      {/* <PromoModal displayDelay={2 * 1000} /> */}
    </>
  );
}
