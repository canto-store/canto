"use client";
import React from "react";
import { useAuth } from "@/hooks/auth";
import { useMyBrand } from "@/lib/brand";
import { ProductsPage, RegisterPage, BrandPage } from "@/components/sell";

export default function Page() {
  const { user } = useAuth();
  const { isSuccess: hasBrand } = useMyBrand({
    enabled: Boolean(user && user?.role === "SELLER"),
  });

  if (hasBrand) {
    return <ProductsPage />;
  }

  if (!hasBrand && user && user?.role === "SELLER") {
    return <BrandPage />;
  }
  if (!user) {
    return <RegisterPage />;
  }

  return <div>Loading...</div>;
}
