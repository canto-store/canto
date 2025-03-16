"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InstallPWA } from "@/components/pwa";
import { MobileBottomNavigation } from "@/components/layout/MobileBottomNavigation";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4">{children}</main>
      <Footer />
      <InstallPWA variant="message" />
      <MobileBottomNavigation />
    </>
  );
}
