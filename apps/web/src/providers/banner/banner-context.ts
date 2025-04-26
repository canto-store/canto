"use client";

import { createContext } from "react";

export interface BannerContextType {
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

export const BannerContext = createContext<BannerContextType | null>(null);
