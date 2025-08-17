"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { useIsPWAInstalled } from "@/hooks/useIsPWAInstalled";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const InstallPWA = dynamic(
    () => import("@/components/pwa").then((m) => m.InstallPWA),
    { ssr: false },
  );
  const isInstalled = useIsPWAInstalled();

  return (
    <>
      <Header />
      <main className="container mx-auto mb-10 space-y-10 px-4 md:space-y-20">
        {children}
      </main>
      <Footer />
      {isInstalled && <MobileBottomNavigation />}
      <InstallPWA variant="message" displayDelay={8 * 1000} />
      {/* <PromoModal displayDelay={2 * 1000} /> */}
    </>
  );
}
