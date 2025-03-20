"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-h-2 flex h-full snap-x snap-mandatory gap-3 overflow-x-scroll pb-7">
      {products.map((product, index) => (
        <div key={product.name} className="flex-1 snap-center snap-always">
          <ProductCard
            product={product}
            priority={index === 0}
            index={index}
            className="w-50"
          />
        </div>
      ))}
    </div>
  );
}
