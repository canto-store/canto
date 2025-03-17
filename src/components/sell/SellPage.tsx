import React from "react";
import { useTranslations } from "next-intl";
import { SellForm } from "./SellForm";

export default function SellPage() {
  const t = useTranslations("sell");

  return (
    <div className="mx-auto flex h-[calc(100vh-6.5rem-5rem)] max-w-2xl flex-col items-center justify-center md:h-[calc(100vh-6.5rem)]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("description")}</p>
      </div>
      <SellForm />
    </div>
  );
}
