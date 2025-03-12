"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/cart-provider";
import { BannerProvider } from "./banner/banner-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <BannerProvider>
      <CartProvider>{children}</CartProvider>
    </BannerProvider>
  );
}
