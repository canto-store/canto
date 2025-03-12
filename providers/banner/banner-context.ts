"use client";

import { createContext } from "react";

export interface BannerContextType {
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  closeBanner: () => void;
  isLoading: boolean;
}

export const BannerContext = createContext<BannerContextType>({
  showBanner: true,
  setShowBanner: () => {},
  closeBanner: () => {},
  isLoading: true,
});
