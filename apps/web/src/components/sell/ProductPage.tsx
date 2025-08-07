import { useTranslations } from "next-intl";
import { ProductTable } from "../products/table/ProductTable";
import { useMyBrand } from "@/lib/brand";
import { useProductsByBrand } from "@/lib/product";
import Spinner from "../common/Spinner";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function ProductPage() {
  const t = useTranslations("sell");

  const { data: brand } = useMyBrand();
  const router = useRouter();

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

        <div className="mt-2 flex w-full flex-col gap-2">
          <Button
            onClick={() => {
              router.push("/sell/product");
            }}
            className="self-end justify-self-end"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          <div className="w-full">
            <ProductTable products={products} />
          </div>
        </div>
      </div>
    );
}
