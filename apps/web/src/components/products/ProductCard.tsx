"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useAddToCart } from "@/lib/cart";
import { ProductSummary } from "@canto/types/product";
import { BsCartPlus, BsEye } from "react-icons/bs";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  priority = false,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { mutateAsync: addToCart } = useAddToCart();

  const handleAddToCart = (product: ProductSummary) => {
    addToCart({
      variantId: product.default_variant_id!,
      quantity: 1,
    });
  };

  const handleProductClick = (product: ProductSummary) => {
    router.push(`/product/${encodeURIComponent(product.slug)}`);
  };

  const handleBrandClick = (product: ProductSummary) => {
    router.push(`/browse?brand=${encodeURIComponent(product.brand.slug)}`);
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg shadow-lg transition-transform duration-300 hover:scale-102 hover:shadow-xl",
        className,
      )}
    >
      <button
        onClick={() => handleProductClick(product)}
        className="hover:cursor-pointer"
      >
        <Image
          src={product.image || "/placeholder-image.jpg"}
          alt={product.name}
          className="aspect-square w-full transform rounded-t-lg object-cover"
          width={600}
          height={600}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          quality={80}
        />
      </button>
      <div className="flex flex-1 flex-col justify-between p-3 md:p-4">
        <div className="flex min-h-[36px] flex-col gap-1">
          <button
            onClick={() => handleProductClick(product)}
            className="w-full hover:cursor-pointer"
          >
            <h3
              className={cn(
                "line-clamp-2 text-sm font-semibold md:text-lg",
                isRTL ? "text-right" : "text-left",
              )}
            >
              {product.name}
            </h3>
          </button>
          <button
            onClick={() => handleBrandClick(product)}
            className={cn(
              "line-clamp-1 w-full text-xs text-gray-600 hover:cursor-pointer sm:mb-3 sm:text-sm",
              isRTL ? "text-right" : "text-left",
            )}
          >
            <p>{product.brand.name}</p>
          </button>
        </div>

        <div
          className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse",
          )}
        >
          <div className="flex items-center gap-0.5">
            {product.salePrice && (
              <span className="font-bold sm:text-lg md:text-xl">
                {formatPrice(product.salePrice)}
              </span>
            )}
            <span
              className={cn(
                product.salePrice
                  ? "text-gray-500 line-through sm:text-sm md:text-base"
                  : "font-bold sm:text-lg md:text-xl",
              )}
            >
              {formatPrice(product.price)}
              {product.maxPrice && (
                <span className="font-bold sm:text-lg md:text-xl">
                  {" "}
                  - {formatPrice(product.maxPrice)}
                </span>
              )}
            </span>
          </div>
          {product.hasVariants ? (
            <Button
              onClick={() => router.push(`/product/${product.slug}`)}
              size="icon"
            >
              <BsEye className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          ) : (
            <Button onClick={() => handleAddToCart(product)} size="icon">
              <BsCartPlus className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
