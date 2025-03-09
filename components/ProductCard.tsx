import { Button } from "@/components/ui/button";

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
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
        <p className="mb-2 text-sm text-gray-600">{product.brand}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <Button
            onClick={() => onAddToCart(product.name)}
            size="sm"
            color="white"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
