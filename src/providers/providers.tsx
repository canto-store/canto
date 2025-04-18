"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart/cart-provider";
import { BannerProvider } from "./banner/banner-provider";
import { AuthProvider } from "./auth/auth-provider";
import { QueryProvider } from "./query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <BannerProvider>
          <CartProvider>
            {children}

            <ReactQueryDevtools initialIsOpen={false} />
          </CartProvider>
        </BannerProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
