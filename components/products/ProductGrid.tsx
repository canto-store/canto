import { ProductCard } from "@/components/products";
import { Product } from "@/types";
import { SectionContainer } from "@/components/common";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

export function ProductGrid({ products, title, className }: ProductGridProps) {
  return (
    <SectionContainer title={title}>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5",
          className,
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </SectionContainer>
  );
}
