"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { BannerProvider } from "./banner/banner-provider";
import { QueryProvider } from "./query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <QueryProvider>
        <BannerProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </BannerProvider>
      </QueryProvider>
    </HeroUIProvider>
  );
}
