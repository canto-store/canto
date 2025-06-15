import { ProductCarousel, ProductGrid } from "@/components/products";
import { ProductSummary } from "@/types";
import { useMediaQuery } from "react-haiku";
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
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  if (isLoading || products === undefined) {
    return <HomeProductsSkeleton />;
  }

  if (products && products.length > 0) {
    return (
      <section className="py-10 lg:py-14">
        <h2 className="mb-8 text-center text-3xl font-bold md:mb-10 md:text-4xl lg:text-5xl">
          {title}
        </h2>

        {/* Mobile and Tablet View (hidden on lg screens and above) */}
        {isMobile ? (
          <ProductCarousel products={products} />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    );
  }
}
