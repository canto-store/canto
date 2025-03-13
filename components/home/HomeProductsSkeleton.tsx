import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

interface HomeProductsSkeletonProps {
  productCount?: number;
}

export function HomeProductsSkeleton({
  productCount = 5,
}: HomeProductsSkeletonProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Title skeleton */}
        <div className="mb-4 flex justify-center">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 md:h-10 md:w-64" />
        </div>

        {/* Products grid skeleton */}
        <ProductGridSkeleton count={productCount} />
      </div>
    </section>
  );
}
