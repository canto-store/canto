import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";

export interface Product {
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productName: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative flex h-[400px] flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 min-h-[48px] font-semibold">
            {product.name}
          </h3>
          <p className="mb-2 line-clamp-1 text-sm text-gray-600">
            {product.brand}
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => onAddToCart(product.name)}
              size="sm"
              className="flex-1 gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
              asChild
            >
              <a
                href={`/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}
              >
                <Eye className="h-4 w-4" />
                View
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
