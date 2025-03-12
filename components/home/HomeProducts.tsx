import { ProductGrid } from "@/components/products";
import { Product } from "@/types";

interface HomeProductsProps {
  products: Product[];
  title: string;
}

export function HomeProducts({ products, title }: HomeProductsProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          {title}
        </h2>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
