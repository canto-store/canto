"use client";
import { useTranslations } from "next-intl";
import { BrandForm } from "@/components/sell/BrandForm";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import Spinner from "@/components/common/Spinner";
import { useUserStore } from "@/stores/useUserStore";

export default function BrandPage() {
  const t = useTranslations("sell");

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated)
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
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
  return <Spinner />;
}
