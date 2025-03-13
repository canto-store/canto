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
    <div className="w-full px-2 sm:px-3 md:px-4 lg:px-0">
      {title && (
        <h3 className="mb-3 text-lg font-semibold sm:mb-4 md:mb-6 md:text-xl">
          {title}
        </h3>
      )}

      <div
        className={cn(
          "xs:gap-3 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4",
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
