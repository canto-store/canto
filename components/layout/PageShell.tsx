"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useCart } from "@/components/cart";

interface PageShellProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function PageShell({ children, title, className = "" }: PageShellProps) {
  const { count: cartCount } = useCart();

  return (
    <div className="min-h-screen bg-white text-black">
      <Header cartCount={cartCount} />
      <main className={`pt-24 pb-16 ${className}`}>
        <div className="container mx-auto px-4">
          {title && <h1 className="mb-8 text-3xl font-bold">{title}</h1>}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
