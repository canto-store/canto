import React from "react";
import { useTranslations } from "next-intl";
import { SellForm } from "./SellForm";

export default function SellPage() {
  const t = useTranslations("sell");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("description")}</p>
      </div>
      <SellForm />
    </div>
  );
}
