"use client";

import React from "react";
import { useMyBrand } from "@/lib/brand";
import { ProductsPage, BrandPage } from "@/components/sell";
import Spinner from "@/components/common/Spinner";

export default function Page() {
  const { isSuccess: hasBrand, isLoading: isBrandLoading } = useMyBrand();

  if (isBrandLoading) {
    return <Spinner />;
  }

  if (hasBrand) {
    return <ProductsPage />;
  }

  if (!hasBrand) {
    return <BrandPage />;
  }
}
