import { useTranslations } from "next-intl";
import ProductsForm from "@/components/products/ProductsForm";

export default function ProductsPage() {
  const t = useTranslations("sell");

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold tracking-tight">
        {t("products.title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600">{t("products.description")}</p>
      <div className="w-full">
        <ProductsForm />
      </div>
    </div>
  );
}
