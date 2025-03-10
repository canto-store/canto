"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PromoBanner } from "@/components/common/PromoBanner";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  cartCount: number;
}

export function PageLayout({ children, cartCount }: PageLayoutProps) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary)]">
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
          showBanner ? "translate-y-0" : "-translate-y-12",
        )}
      >
        <PromoBanner onClose={() => setShowBanner(false)} />
      </div>
      <Header
        cartCount={cartCount}
        className={cn(
          "fixed right-0 left-0 transition-all duration-300",
          showBanner ? "top-10" : "top-0",
        )}
      />
      <main
        className={cn(
          "transition-all duration-300",
          showBanner ? "pt-28" : "pt-16",
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
