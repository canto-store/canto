"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { SellerForm } from "@/components/sell/SellerForm";
import { useAuth } from "@/providers/auth/use-auth";
import { BrandForm } from "@/components/sell/BrandForm";
import { useMyBrand } from "@/lib/brand";
import ProductsForm from "@/components/products/ProductsForm";

export default function Page() {
  const t = useTranslations("sell");
  const { user, isAuthenticated } = useAuth();
  const { isSuccess: hasBrand, isLoading: isLoadingBrand } = useMyBrand({
    enabled: isAuthenticated && user?.role === "SELLER",
  });

  let contentToRender;
  if (isAuthenticated && user?.role === "SELLER") {
    contentToRender = hasBrand ? <ProductsForm /> : <BrandForm />;
  } else {
    contentToRender = <SellerForm />;
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("description")}</p>
      </div>
      <div className="w-full">{contentToRender}</div>
    </div>
  );
}
