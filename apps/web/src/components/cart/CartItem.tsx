"use client";

import { Minus, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useAddToCart, useDeleteFromCart } from "@/lib/cart";
import { CartItem } from "@canto/types/cart";
import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";

interface CartItemProps {
  item: CartItem;
  showControls?: boolean;
  className?: string;
  compact?: boolean;
}

export function CartItemComponent({
  item,
  showControls = true,
  className,
  compact = false,
}: CartItemProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { mutate: deleteFromCart, isPending: isRemoving } = useDeleteFromCart();
  const { mutateAsync: addToCart, isPending: isAdding } = useAddToCart();
  const router = useRouter();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    addToCart({
      variantId: item.variantId,
      quantity: newQuantity,
    });
  };

  const handleRemove = async () => {
    deleteFromCart({ variantId: item.variantId });
  };

  const handleProductClick = () => {
    router.push(`/product/${item.slug.toLowerCase()}`);
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
            src={item.image}
            alt={item.name}
            width={48}
            height={48}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="text-primary line-clamp-1 text-xs font-medium sm:text-sm">
            {item.name}
          </h4>
          <p className="text-xs text-gray-500">{item.brand.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 flex-shrink-0 self-start rounded-full hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          aria-label={t("cart.removeItem")}
        >
          <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-gray-200 py-2 sm:flex-row sm:py-3",
        className,
      )}
    >
      {/* Product Image */}
      <div className="mx-auto mb-2 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:mx-0 sm:mb-0 sm:h-20 sm:w-20">
        <Image
          src={item.image}
          alt={item.name}
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
            <h3 className="text-center text-sm font-medium text-gray-900 sm:text-left sm:text-base">
              {item.name}
            </h3>
            <p className="text-primary mt-1 text-center text-sm font-medium sm:mt-0 sm:ml-4 sm:text-left">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
          <p className="mt-1 text-center text-xs text-gray-500 sm:text-left sm:text-sm">
            {item.brand.name}
          </p>
        </div>

        <div className="mt-2 flex flex-1 items-center justify-center sm:mt-3 sm:justify-start">
          {showControls ? (
            <div className="flex w-full flex-col items-center sm:w-auto sm:flex-row">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-none sm:h-8 sm:w-8"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isAdding || isRemoving}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-6 text-center text-xs sm:w-8 sm:text-sm">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-none sm:h-8 sm:w-8"
                  disabled={
                    isAdding || isRemoving || item.stock == item.quantity
                  }
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "mt-2 text-xs text-gray-500 sm:mt-0 sm:text-sm",
                  isRTL ? "sm:mr-4" : "sm:ml-4",
                )}
                disabled={isRemoving || isAdding}
                onClick={handleRemove}
              >
                <Trash2
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    isRTL ? "ml-1" : "mr-1",
                  )}
                />
                {t("cart.removeItem")}
              </Button>
            </div>
          ) : (
            <div className="text-xs text-gray-500 sm:text-sm">
              {t("cart.quantity")}: {item.quantity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
