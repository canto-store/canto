"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InstallPWA } from "@/components/pwa";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
// import { PromoModal } from "../home/PromoModal";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto space-y-10 px-4 md:space-y-20">
        {children}
      </main>
      <Footer />
      <MobileBottomNavigation />
      <InstallPWA variant="message" displayDelay={8 * 1000} />
      {/* <PromoModal displayDelay={2 * 1000} /> */}
    </>
  );
}
