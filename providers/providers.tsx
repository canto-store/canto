"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/cart-provider";
import { BannerProvider } from "./banner/banner-provider";
import { AuthProvider } from "./auth/auth-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <BannerProvider>
        <CartProvider>{children}</CartProvider>
      </BannerProvider>
    </AuthProvider>
  );
}
