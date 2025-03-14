"use client";

import { useState, ReactNode } from "react";
import { BannerContext } from "./banner-context";

interface BannerProviderProps {
  children: ReactNode;
}

export function BannerProvider({ children }: BannerProviderProps) {
  // Remove the loading state that was causing the delay
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Close the banner for the current session only
  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <BannerContext.Provider
      value={{
        showBanner,
        setShowBanner,
        closeBanner,
        isLoading: false, // Always set to false to ensure immediate rendering
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}
