"use client";

import { useState, ReactNode } from "react";
import { BannerContext } from "./banner-context";

interface BannerProviderProps {
  children: ReactNode;
}

export function BannerProvider({ children }: BannerProviderProps) {
  const [showBanner, setShowBanner] = useState<boolean>(true);

  return (
    <BannerContext.Provider
      value={{
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}
