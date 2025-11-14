"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { useIsInstalled } from "@/hooks/useIsInstalled";
import InstallPrompt from "../common/InstallPrompt";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isInstalled = useIsInstalled();
  const isMobile = useMediaQuery("(max-width: 640px)", false);
  return (
    <>
      {isMobile && <InstallPrompt />}
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
