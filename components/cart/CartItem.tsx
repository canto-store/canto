"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "./CartContext";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  showControls?: boolean;
  className?: string;
  compact?: boolean;
  showRemoveButton?: boolean;
}

export function CartItemComponent({
  item,
  showControls = true,
  className,
  compact = false,
  showRemoveButton = true,
}: CartItemProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

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

  if (compact) {
    return (
      <div
        className={cn("group relative flex items-center gap-5 py-2", className)}
      >
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={item.image}
            alt={getProductName()}
            width={48}
            height={48}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="text-primary line-clamp-1 text-sm font-medium">
            {getProductName()}
          </h4>
          <p className="text-xs text-gray-500">{getBrandName()}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs font-medium">
              ${item.price.toFixed(2)} × {item.quantity}
            </p>
            <p className="text-primary text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>

        {showRemoveButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-1 -right-1 h-8 w-8 rounded-full"
            onClick={handleRemove}
            aria-label={t("cart.removeItem")}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex border-b border-gray-200 py-4", className)}>
      {/* Product Image */}
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.image}
          alt={getProductName()}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div className={cn("flex flex-1 flex-col", isRTL ? "mr-8" : "ml-8")}>
        <div>
          <div className="flex justify-between">
            <h3 className="text-base font-medium text-gray-900">
              {getProductName()}
            </h3>
            <p className="text-primary ml-4 text-base font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{getBrandName()}</p>
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between">
          {showControls ? (
            <div className="flex items-center">
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
                className={cn("text-sm text-gray-500", isRTL ? "mr-4" : "ml-4")}
                onClick={handleRemove}
              >
                <Trash2 className={cn("h-4 w-4", isRTL ? "ml-1" : "mr-1")} />
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
