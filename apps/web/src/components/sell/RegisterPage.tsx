import React from "react";
import { useTranslations } from "next-intl";
import { SellerForm } from "@/components/sell/SellerForm";

export default function RegisterPage() {
  const t = useTranslations("sell");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("register.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {t("register.description")}
        </p>
      </div>
      <div className="w-full">
        <SellerForm />
      </div>
    </div>
  );
}
