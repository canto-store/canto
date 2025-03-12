"use client";

import { useState, useEffect, ReactNode } from "react";
import { BannerContext } from "./banner-context";

interface BannerProviderProps {
  children: ReactNode;
}

export function BannerProvider({ children }: BannerProviderProps) {
  // Start with loading state to prevent flash
  const [isLoading, setIsLoading] = useState(true);
  // Always start with the banner visible
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Set loading to false after initial render
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Short timeout to ensure the component has fully mounted
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

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
        isLoading,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}
