"use client";

import React, { useEffect } from "react";
import { useMyBrand } from "@/lib/brand";
import Spinner from "@/components/common/Spinner";
import { useRouter } from "@/i18n/navigation";

export default function Page() {
  const { isSuccess: hasBrand, isLoading: isBrandLoading } = useMyBrand();
  const router = useRouter();
  useEffect(() => {
    if (isBrandLoading) return;
    if (hasBrand) {
      router.replace("/sell/products");
    } else {
      router.replace("/sell/brand");
    }
  }, [hasBrand, isBrandLoading, router]);

  // Render a fallback while redirecting
  return <Spinner />;
}
