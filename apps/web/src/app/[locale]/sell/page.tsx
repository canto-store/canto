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

  // Show loading state while checking auth or brand status
  if (isAuthenticated && user?.role === "SELLER" && isLoadingBrand) {
    return <FormSectionSkeleton />;
  }

  // Determine which form to show
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

const FormSectionSkeleton = () => (
  <div
    className="w-full animate-pulse space-y-6 rounded-lg bg-gray-100 p-6 py-8 shadow-sm sm:p-8"
    aria-label="Loading form data" // For accessibility
  >
    {/* Placeholder for a form title or main heading within the form area */}
    <div className="mb-6 h-7 w-3/4 rounded bg-gray-300"></div>

    {/* Placeholder for a fieldset or group of inputs */}
    <div className="space-y-3">
      <div className="h-5 w-1/3 rounded bg-gray-300"></div> {/* Label */}
      <div className="h-9 rounded bg-gray-300"></div> {/* Input */}
    </div>

    {/* Another placeholder for a fieldset */}
    <div className="space-y-3">
      <div className="h-5 w-1/4 rounded bg-gray-300"></div> {/* Label */}
      <div className="h-9 rounded bg-gray-300"></div> {/* Input */}
    </div>

    {/* Placeholder for another field or a descriptive text */}
    <div className="h-5 w-full rounded bg-gray-300"></div>

    {/* Placeholder for a submit button */}
    <div className="mt-8 h-10 w-full rounded bg-gray-300 sm:w-1/2"></div>
  </div>
);
