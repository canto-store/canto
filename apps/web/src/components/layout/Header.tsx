"use client";

import { WebHeader } from "./WebHeader";
import { MobileHeader } from "./MobileHeader";
// import { PromoBanner } from "./PromoBanner";
import { useMediaQuery } from "react-haiku";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)", { ssr: true });
  return (
    <>
      <header className="border-primary bg-global sticky top-0 z-50 w-full border-b">
        {/* <PromoBanner /> */}
        {isMobile ? <MobileHeader /> : <WebHeader />}
      </header>
    </>
  );
}
