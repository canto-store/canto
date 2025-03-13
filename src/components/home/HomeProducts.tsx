import { ProductCarousel, ProductGrid } from "@/components/products";
import { Product } from "@/types";

interface HomeProductsProps {
  products: Product[];
  title: string;
}

export function HomeProducts({ products, title }: HomeProductsProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {title}
        </h2>

        {/* Mobile and Tablet View (hidden on lg screens and above) */}
        <div className="mx-auto max-w-4xl lg:hidden">
          <ProductCarousel products={products} />
        </div>

        {/* Desktop View (hidden on md screens and below) */}
        <div className="hidden lg:block">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
