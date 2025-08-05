import { useMyBrand } from "@/lib/brand";
import { useProductsByBrand } from "@/lib/product";
import Image from "next/image";
import { Package } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
export const ProductDisplay = () => {
  const { data: brand } = useMyBrand();

  const { data: products, isLoading: isFetchingProducts } = useProductsByBrand(
    brand?.id ?? 0,
  );
  return (
    <div className="min-h-full overflow-auto rounded-lg shadow-sm">
      {products && products.length > 0 ? (
        <div>
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-2 border-b-1 p-1"
            >
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={64}
                height={32}
                className="rounded-md object-cover"
              />
              <h3 className="font-medium">{product.name}</h3>
            </div>
          ))}
        </div>
      ) : isFetchingProducts ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 border-b p-3">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <Package className="text-primary mb-4 h-16 w-16" />
          <span className="text-gray-500">No products uploaded yet.</span>
        </div>
      )}
    </div>
  );
};
