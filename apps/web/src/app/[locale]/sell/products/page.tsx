"use client";
import React from "react";
import { useTranslations } from "next-intl";
import ProductsForm from "@/components/products/ProductsForm";
import { useAuth } from "@/hooks/auth";
import { useMyBrand } from "@/lib/brand";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const t = useTranslations("sell");
  const { user } = useAuth();
  const router = useRouter();
  const { isSuccess: hasBrand } = useMyBrand({
    enabled: Boolean(user && user?.role === "SELLER"),
  });

  React.useEffect(() => {
    if (!user || user?.role !== "SELLER") {
      router.push("/sell/register");
    } else if (!hasBrand) {
      router.push("/sell/brand");
    }
  }, [user, user?.role, hasBrand, router]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("products.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {t("products.description")}
        </p>
      </div>
      <div className="w-full">
        <ProductsForm />
      </div>
    </div>
  );
}
