"use client";

import { Minus, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";

interface OrderItemProps {
  item: any; // update with your order API type if you have it
  showControls?: boolean;
  className?: string;
  compact?: boolean;
}

export function OrderItemComponent({
  item,
  showControls = false,
  className,
  compact = false,
}: OrderItemProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${item.variant.product.slug.toLowerCase()}`);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "group relative flex h-full w-full cursor-pointer items-center gap-3 py-2 hover:bg-gray-50 sm:gap-5",
          className,
        )}
        onClick={handleProductClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleProductClick();
          }
        }}
      >
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:h-12 sm:w-12">
          <Image
            src={item.variant.images?.[0]?.url || item.variant.product.image}
            alt={item.variant.product.name}
            width={48}
            height={48}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="text-primary line-clamp-1 text-xs font-medium sm:text-sm">
            {item.variant.product.name}
          </h4>
          <p className="text-xs text-gray-500">
            {item.variant.product.brand.name}
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs font-medium">
              {formatPrice(item.priceAtOrder * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col py-2 sm:flex-row sm:py-3", className)}>
      {/* Product Image */}
      <div className="mx-auto mb-2 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:mx-0 sm:mb-0 sm:h-20 sm:w-20">
        <Image
          src={item.variant.images?.[0]?.url || item.variant.product.image}
          alt={item.variant.product.name}
          width={80}
          height={80}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isRTL ? "mr-0 sm:mr-6" : "ml-0 sm:ml-6",
        )}
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <h3 className="text-sm font-medium text-gray-900 sm:text-base">
              {item.variant.product.name}
            </h3>
            <p className="text-primary mt-1 text-sm font-medium sm:mt-0 sm:text-left">
              {formatPrice(item.priceAtOrder * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            {item.variant.product.brand.name}
          </p>
        </div>

        {/* Options section */}
        {item.variant.optionLinks?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-4">
            {item.variant.optionLinks.map((link: any) => (
              <div key={link.productOption.id}>
                <h3 className="font-medium text-gray-900">
                  {link.productOption.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className="focus-visible:border-ring focus-visible:ring-ring/50 bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-auto shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50">
                    {link.optionValue.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
