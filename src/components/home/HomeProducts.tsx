import { ProductCarousel, ProductGrid } from "@/components/products";
import { ProductSummary } from "@/types";
import { useMediaQuery } from "react-haiku";

interface HomeProductsProps {
  products: ProductSummary[];
  title: string;
}

export function HomeProducts({ products, title }: HomeProductsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)", false);

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
