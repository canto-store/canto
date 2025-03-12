"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers";
import { CartItem } from "@/types";
import { cn } from "@/lib/utils";
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
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const getProductName = () => {
    if (item.translationKey && item.translationKey.name) {
      return t(item.translationKey.name);
    }
    return item.name;
  };

  const getBrandName = () => {
    if (item.translationKey && item.translationKey.brand) {
      return t(item.translationKey.brand);
    }
    return item.brand;
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    updateQuantity(item.name, newQuantity);

    // Simulate network delay for UI feedback
    setTimeout(() => {
      setIsUpdating(false);
    }, 300);
  };

  const handleRemove = () => {
    removeItem(item.name);
  };

  const handleProductClick = () => {
    router.push(`/product/${encodeURIComponent(item.name.toLowerCase())}`);
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
            alt={getProductName()}
            width={48}
            height={48}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="text-primary line-clamp-1 text-xs font-medium sm:text-sm">
            {getProductName()}
          </h4>
          <p className="text-xs text-gray-500">{getBrandName()}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs font-medium">
              ${item.price.toFixed(2)} × {item.quantity}
            </p>
            <p className="text-primary text-xs font-medium sm:text-sm">
              ${(item.price * item.quantity).toFixed(2)}
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
        "flex flex-col border-b border-gray-200 py-4 sm:flex-row",
        className,
      )}
    >
      {/* Product Image */}
      <div className="mx-auto mb-4 h-32 w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:mx-0 sm:mb-0 sm:h-24 sm:w-24">
        <Image
          src={item.image}
          alt={getProductName()}
          width={128}
          height={128}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isRTL ? "mr-0 sm:mr-8" : "ml-0 sm:ml-8",
        )}
      >
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <h3 className="text-center text-base font-medium text-gray-900 sm:text-left">
              {getProductName()}
            </h3>
            <p className="text-primary mt-1 text-center text-base font-medium sm:mt-0 sm:ml-4 sm:text-left">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          <p className="mt-1 text-center text-sm text-gray-500 sm:text-left">
            {getBrandName()}
          </p>
        </div>

        <div className="mt-4 flex flex-1 items-center justify-center sm:justify-start">
          {showControls ? (
            <div className="flex flex-col items-center sm:flex-row">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "mt-3 text-xs text-gray-500 sm:mt-0 sm:text-sm",
                  isRTL ? "sm:mr-4" : "sm:ml-4",
                )}
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
            <div className="text-sm text-gray-500">
              {t("cart.quantity")}: {item.quantity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
