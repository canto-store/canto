import { ProductCard, type Product } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productName: string) => void;
  title?: string;
  className?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  title,
  className,
}: ProductGridProps) {
  return (
    <section className="px-4 py-16">
      <div className="container mx-auto">
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        <div
          className={cn(
            "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4",
            className,
          )}
        >
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
