"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-h-2 flex h-full snap-x snap-mandatory gap-4 overflow-x-scroll pb-7">
      {products.map((product, index) => (
        <div key={product.name}>
          <ProductCard product={product} priority={index === 0} index={index} />
        </div>
      ))}
    </div>
  );
}
