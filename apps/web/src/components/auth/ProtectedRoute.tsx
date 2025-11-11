"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/stores/useUserStore";
import { Skeleton } from "../ui/skeleton";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated)
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <Skeleton className="h-98 w-full" />
      </div>
    );
  return <>{children}</>;
}
