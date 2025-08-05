"use client";

import React from "react";
import { useMyBrand } from "@/lib/brand";
import { ProductPage, BrandPage } from "@/components/sell";
import Spinner from "@/components/common/Spinner";

export default function Page() {
  const { isSuccess: hasBrand, isLoading: isBrandLoading } = useMyBrand();

  if (isBrandLoading) {
    return <Spinner />;
  }

  if (hasBrand) {
    return <ProductPage />;
  }

  if (!hasBrand) {
    return <BrandPage />;
  }
}
