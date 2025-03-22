"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InstallPWA } from "@/components/pwa";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";
import { PromoModal } from "../home/PromoModal";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4">{children}</main>
      <Footer />
      <InstallPWA variant="message" displayDelay={8 * 1000} />
      <MobileBottomNavigation />
      <PromoModal displayDelay={2 * 1000} />
    </>
  );
}
