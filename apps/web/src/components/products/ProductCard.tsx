"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCart } from "@/providers";
import { ProductSummary } from "@/types";
import { BsCartPlus, BsEye } from "react-icons/bs";

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
  index?: number;
  className?: string;
}

export function ProductCard({
  product,
  priority = false,
  index = 0,
  className,
}: ProductCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { addToCart } = useCart();

  const handleProductClick = (product: ProductSummary) => {
    router.push(
      `/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`,
    );
  };

  const handleBrandClick = (product: ProductSummary) => {
    router.push(`/browse?brand=${encodeURIComponent(product.brand.slug)}`);
  };

  // Determine if this product should be prioritized
  const shouldPrioritize = priority || index < 2;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg shadow-lg hover:shadow-xl",
        className,
      )}
    >
      <button
        onClick={() => handleProductClick(product)}
        className="hover:cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.name}
          className="transform rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-110"
          width={600}
          height={600}
          priority={shouldPrioritize}
          loading={shouldPrioritize ? "eager" : "lazy"}
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

        <div className="mt-1 flex gap-1">
          {product.colorVariants?.map((color, index) => (
            <div
              key={index}
              className="h-4 w-4 rounded-full border-1 border-black"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div
          className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse",
          )}
        >
          <div className="flex items-center gap-0.5">
            <span className="text-xs font-bold md:text-base">EGP</span>
            {product.salePrice && (
              <span className="font-bold sm:text-lg md:text-xl">
                {product.salePrice}
              </span>
            )}
            <span
              className={cn(
                product.salePrice
                  ? "text-gray-500 line-through sm:text-sm md:text-base"
                  : "font-bold sm:text-lg md:text-xl",
              )}
            >
              {product.price}
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
            <Button onClick={() => addToCart(product)} size="icon">
              <BsCartPlus className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
