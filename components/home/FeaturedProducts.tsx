import { ProductGrid } from "@/components/products";
import { type Product } from "@/components/products/ProductCard";
import { useTranslations } from "next-intl";

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (productName: string) => void;
}

export function FeaturedProducts({
  products,
  onAddToCart,
}: FeaturedProductsProps) {
  const t = useTranslations();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          {t("products.relatedProducts")}
        </h2>
        <ProductGrid products={products} onAddToCart={onAddToCart} />
      </div>
    </section>
  );
}
