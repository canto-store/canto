import { ProductCard } from "@/components/products";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  title?: string;
  className?: string;
}

export function ProductGrid({ products, title, className }: ProductGridProps) {
  return (
    <div className="w-full">
      {title && <h3 className="mb-6 text-xl font-semibold">{title}</h3>}

      <div
        className={cn(
          "grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
}
