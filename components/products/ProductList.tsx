import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { type Product } from "./ProductCard";
import { SectionContainer } from "@/components/common";
import { cn } from "@/lib/utils";

interface ProductListProps {
  products: Product[];
  onAddToCart: (productName: string) => void;
  title?: string;
  className?: string;
}

export function ProductList({
  products,
  onAddToCart,
  title,
  className,
}: ProductListProps) {
  return (
    <SectionContainer title={title}>
      <div className={cn("space-y-4", className)}>
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row"
          >
            <div className="h-48 w-full sm:h-auto sm:w-48">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="mb-1 text-lg font-semibold text-black">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-black">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onAddToCart(product.name)}
                    size="sm"
                    className="gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a
                      href={`/product/${encodeURIComponent(
                        product.name.toLowerCase().replace(/\s+/g, "-"),
                      )}`}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
