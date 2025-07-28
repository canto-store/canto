import { useTranslations } from "next-intl";
import { BrandForm } from "@/components/sell/BrandForm";

export default function BrandPage() {
  const t = useTranslations("sell");

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
}
