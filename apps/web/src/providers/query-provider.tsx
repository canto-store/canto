"use client";

import { parseApiError } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
            throwOnError(error) {
              console.error(parseApiError(error));
              return false;
            },
          },
          mutations: {
            retry: 1,
            onError(error) {
              const message = parseApiError(error);
              toast.error(message);
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
