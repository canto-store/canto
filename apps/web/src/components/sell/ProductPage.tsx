import { ProductDisplay } from "../products/ProductDisplay";
import ProductForm from "../products/ProductForm";
import { useTranslations } from "next-intl";

export default function ProductPage() {
  const t = useTranslations("sell");

  return (
    <div className="mx-auto flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold tracking-tight">
        {t("products.title")}
      </h1>
      <p className="mt-4 text-lg text-gray-600">{t("products.description")}</p>
      <div className="w-full">
        <div className="container mx-auto max-w-6xl p-4">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Left panel - Product list */}
            <ProductDisplay />
            {/* Right panel - Product form */}
            <ProductForm />
          </div>
        </div>
      </div>
    </div>
  );
}
