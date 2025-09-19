"use client";

import { ProductCard } from "./ProductCard";
import { ProductSummary } from "@canto/types/product";

export function ProductCarousel({ products }: { products: ProductSummary[] }) {
  return (
    <div className="flex h-full snap-x snap-mandatory gap-3 overflow-x-scroll">
      {products.map((product) => (
        <div key={product.name} className="flex-1 snap-center snap-always">
          <ProductCard product={product} priority={true} className="w-50" />
        </div>
      ))}
    </div>
  );
}
