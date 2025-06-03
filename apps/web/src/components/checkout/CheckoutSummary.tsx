"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { CouponData } from "./CouponForm";
import { UserAddress } from "@/types/user";

interface CheckoutSummaryProps {
  className?: string;
  coupon: CouponData | null;
  shippingAddress: UserAddress | null;
  onPlaceOrder?: () => void;
  isLoading?: boolean;
}

export function CheckoutSummary({
  className,
  coupon,
  shippingAddress,
  onPlaceOrder,
  isLoading = false,
}: CheckoutSummaryProps) {
  const { price: subtotal, count } = useCartStore();
  const t = useTranslations();
  const router = useRouter();

  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(subtotal);

  // Calculate shipping cost based on shipping address
  useEffect(() => {
    if (shippingAddress) {
      setShippingCost(50);
    } else {
      setShippingCost(0);
    }
  }, [shippingAddress]);

  // Calculate discount amount based on coupon
  useEffect(() => {
    if (coupon) {
      if (coupon.discountType === "percentage") {
        setDiscountAmount((subtotal * coupon.discountAmount) / 100);
      } else {
        setDiscountAmount(coupon.discountAmount);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [coupon, subtotal]);

  // Calculate total
  useEffect(() => {
    const calculatedTotal = Math.max(
      0,
      subtotal + shippingCost - discountAmount,
    );
    setTotal(calculatedTotal);
  }, [subtotal, shippingCost, discountAmount]);

  if (count === 0) {
    return (
      <div
        className={cn(
          "h-auto rounded-lg border border-gray-200 p-3 sm:p-4",
          className,
        )}
      >
        <h2 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
          {t("checkout.orderSummary")}
        </h2>
        <p className="mb-2 text-sm text-gray-500 sm:mb-3 sm:text-base">
          {t("cart.emptyCart")}
        </p>
        <Button
          className="w-full text-sm sm:text-base"
          onClick={() => router.push("/browse")}
        >
          {t("cart.startShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-auto rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <h2 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
        {t("checkout.orderSummary")}
      </h2>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <p>{t("checkout.subtotal")}</p>
          <p className="font-medium">{formatPrice(subtotal)}</p>
        </div>

        <div className="flex justify-between text-xs sm:text-sm">
          <p>{t("checkout.shipping")}</p>
          {shippingCost > 0 ? (
            <p className="font-medium">{formatPrice(shippingCost)}</p>
          ) : (
            <p className="text-gray-500">{t("checkout.calculatedNext")}</p>
          )}
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs sm:text-sm">
            <p>{t("checkout.discount")}</p>
            <p className="font-medium text-green-600">
              - {formatPrice(discountAmount)}
            </p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 sm:pt-3">
          <div className="flex justify-between text-xs font-medium sm:text-sm">
            <p className="text-gray-900">{t("checkout.orderTotal")}</p>
            <p className="text-primary">{formatPrice(total)}</p>
          </div>

          {!shippingAddress && (
            <p className="mt-1 text-xs text-gray-500">
              {t("checkout.shippingNote")}
            </p>
          )}
        </div>

        <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-2">
          <Button
            className="w-full text-xs sm:text-sm"
            onClick={onPlaceOrder}
            disabled={!shippingAddress || count === 0 || isLoading}
            size="default"
          >
            {isLoading ? t("common.processing") : t("checkout.placeOrder")}
          </Button>

          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push("/cart")}
          >
            {t("checkout.backToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
