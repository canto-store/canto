"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageShellProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function PageShell({ children, title, className = "" }: PageShellProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className={`pt-20 sm:pt-24 ${className}`}>
        <div className="container mx-auto px-2">
          {title && (
            <h1 className="mb-4 text-2xl font-bold sm:mb-8 sm:text-3xl">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
