"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/cart-provider";
import { BannerProvider } from "./banner/banner-provider";
import { AuthProvider } from "./auth/auth-provider";
import { QueryProvider } from "./query-provider";
import { CSSVariablesProvider } from "@/components/layout/CSSVariablesProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <BannerProvider>
          <CSSVariablesProvider>
            <CartProvider>{children}</CartProvider>
          </CSSVariablesProvider>
        </BannerProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
