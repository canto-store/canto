import { ProductCard } from "@/components/products";
import { ProductSummary } from "@/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: ProductSummary[];
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
          "grid grid-cols-2 gap-2 lg:grid-cols-5 lg:gap-4",
          className,
        )}
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.name}
            product={product}
            priority={index < 4}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
