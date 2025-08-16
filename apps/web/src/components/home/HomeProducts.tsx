import { ProductCarousel, ProductGrid } from "@/components/products";
import { ProductSummary } from "@/types";
import { HomeProductsSkeleton } from "./HomeProductsSkeleton";

interface HomeProductsProps {
  products?: ProductSummary[];
  title: string;
  isLoading?: boolean;
}

export function HomeProducts({
  products,
  title,
  isLoading,
}: HomeProductsProps) {
  if (isLoading || products === undefined) {
    return <HomeProductsSkeleton />;
  }

  if (products && products.length > 0) {
    return (
      <section>
        <h2 className="mb-8 text-center text-3xl font-bold md:mb-10 md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <div className="md:hidden">
          <ProductCarousel products={products} />
        </div>
        <div className="hidden md:block">
          <ProductGrid products={products} />
        </div>
      </section>
    );
  }
}
