"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/providers/auth/use-auth";
import { useMyBrand } from "@/lib/brand";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { isSuccess: hasBrand } = useMyBrand({
    enabled: isAuthenticated && user?.role === "SELLER",
  });

  useEffect(() => {
    if (isAuthenticated && user?.role === "SELLER") {
      if (hasBrand) {
        router.push("/sell/products");
      } else {
        router.push("/sell/brand");
      }
    } else {
      router.push("/sell/register");
    }
  }, [isAuthenticated, user?.role, hasBrand, router]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <div className="mb-8 w-full text-center">
        <Skeleton className="mx-auto h-10 w-64" />
        <Skeleton className="mx-auto mt-4 h-6 w-96" />
      </div>
      <div className="w-full max-w-2xl">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
