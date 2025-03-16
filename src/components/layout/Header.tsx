"use client";

import { WebHeader } from "./WebHeader";
import { MobileHeader } from "./MobileHeader";
import { PromoBanner } from "./PromoBanner";

export function Header() {
  return (
    <header className="border-primary bg-global sticky top-0 w-full border-b">
      <PromoBanner />
      <div className="block md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden md:block">
        <WebHeader />
      </div>
    </header>
  );
}
