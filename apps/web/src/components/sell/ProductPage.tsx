import { useTranslations } from "next-intl";
import { ProductTable } from "../products/table/ProductTable";
import { useMyBrand } from "@/lib/brand";
import { useProductsByBrand } from "@/lib/product";
import Spinner from "../common/Spinner";

export default function ProductPage() {
  const t = useTranslations("sell");

  const { data: brand } = useMyBrand();

  const { data: products, isLoading: isFetchingProducts } = useProductsByBrand(
    brand?.id ?? 0,
  );

  if (isFetchingProducts) {
    return <Spinner />;
  }

  if (products)
    return (
      <div className="mx-auto flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("products.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {t("products.description")}
        </p>
        <div className="w-full">
          <ProductTable products={products} />
        </div>
      </div>
    );
}
