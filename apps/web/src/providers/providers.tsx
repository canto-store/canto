"use client";

import { ReactNode } from "react";
import { BannerProvider } from "./banner/banner-provider";
import { QueryProvider } from "./query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUserQuery } from "@/hooks/auth";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  function UserQueryInitializer() {
    useUserQuery();
    return null;
  }

  return (
    <QueryProvider>
      <BannerProvider>
        <UserQueryInitializer />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </BannerProvider>
    </QueryProvider>
  );
}
