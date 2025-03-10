import { ProductGrid, type Product } from "@/components/products";

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (productName: string) => void;
  title?: string;
  className?: string;
}

export function FeaturedProducts({
  products,
  onAddToCart,
  title = "Featured Products",
  className,
}: FeaturedProductsProps) {
  return (
    <ProductGrid
      products={products}
      onAddToCart={onAddToCart}
      title={title}
      className={className}
    />
  );
}
