"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCart } from "@/providers";
import { Product } from "@/types";
import { BsCartPlus } from "react-icons/bs";

interface ProductCardProps {
  product: Product;
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
  const t = useTranslations();
  const productsT = useTranslations("products");
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { addToCart } = useCart();
  // Get translated product name and brand if translation keys are available
  const productName = product.translationKey?.name
    ? t(product.translationKey.name)
    : product.name;

  const brandName = product.translationKey?.brand
    ? t(product.translationKey.brand)
    : product.brand;

  // Format price with proper currency symbol and localization
  const formatPrice = (price: number): string => {
    // Instead of using string replacement, pass the amount as a parameter to the translation function
    return productsT("currency.format", { amount: price.toFixed(2) });
  };

  const handleProductClick = (product: Product) => {
    router.push(
      `/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`,
    );
  };

  const handleBrandClick = (product: Product) => {
    router.push(`/browse?brand=${encodeURIComponent(product.brand)}`);
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
          alt={productName}
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
              {productName}
            </h3>
          </button>
          <button
            onClick={() => handleBrandClick(product)}
            className={cn(
              "line-clamp-1 w-full text-xs text-gray-600 hover:cursor-pointer sm:mb-3 sm:text-sm",
              isRTL ? "text-right" : "text-left",
            )}
          >
            <p>{brandName}</p>
          </button>
        </div>

        <div
          className={cn(
            "flex items-center justify-between",
            isRTL && "flex-row-reverse",
          )}
        >
          <span className="font-bold sm:text-lg md:text-xl">
            {formatPrice(product.price)}
          </span>
          <Button onClick={() => addToCart(product)} size="icon">
            <BsCartPlus className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
