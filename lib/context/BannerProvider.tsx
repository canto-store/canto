"use client";

import { ReactNode } from "react";
import { BannerProvider as InternalBannerProvider } from "./BannerContext";

interface ClientBannerProviderProps {
  children: ReactNode;
}

export function ClientBannerProvider({ children }: ClientBannerProviderProps) {
  return <InternalBannerProvider>{children}</InternalBannerProvider>;
}
