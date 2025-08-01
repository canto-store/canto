"use client";
import React from "react";
import { useAuth } from "@/hooks/auth";
import { useMyBrand } from "@/lib/brand";
import { ProductsPage, RegisterPage, BrandPage } from "@/components/sell";
import { ForbiddenError } from "@/components/sell/ForbiddenError";
import Spinner from "@/components/common/Spinner";

export default function Page() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { isSuccess: hasBrand, isLoading: isBrandLoading } = useMyBrand({
    enabled: Boolean(user && user?.role === "SELLER"),
  });

  if (isUserLoading || isBrandLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Spinner />
      </main>
    );
  }

  if (user && user?.role !== "SELLER") {
    return <ForbiddenError />;
  }
  if (hasBrand) {
    return <ProductsPage />;
  }

  if (!hasBrand && user && user?.role === "SELLER") {
    return <BrandPage />;
  }
  if (!user) {
    return <RegisterPage />;
  }
}
