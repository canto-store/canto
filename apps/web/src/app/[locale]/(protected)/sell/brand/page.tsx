"use client";
import { useTranslations } from "next-intl";
import { BrandForm } from "@/components/sell/BrandForm";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import Spinner from "@/components/common/Spinner";
import { useUserQuery } from "@/lib/auth";

export default function BrandPage() {
  const t = useTranslations("sell");

  const { data, isLoading } = useUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!data && !isLoading) {
      router.replace("/login");
    }
  }, [data, isLoading, router]);

  if (!isLoading && data)
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
