"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { BrandForm } from "@/components/sell/BrandForm";
import { useAuth } from "@/providers/auth/use-auth";
import { useMyBrand } from "@/lib/brand";
import { useRouter } from "next/navigation";

export default function BrandPage() {
  const t = useTranslations("sell");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { isSuccess: hasBrand } = useMyBrand({
    enabled: isAuthenticated && user?.role === "SELLER",
  });

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== "SELLER") {
      router.push("/sell/register");
    } else if (hasBrand) {
      router.push("/sell/products");
    }
  }, [isAuthenticated, user?.role, hasBrand, router]);

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("brand.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">{t("brand.description")}</p>
      </div>
      <div className="w-full">
        <BrandForm />
      </div>
    </div>
  );
}
