"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
}

export function CartSummary({ className }: CartSummaryProps) {
  const { total, count } = useCart();
  const t = useTranslations();
  const router = useRouter();

  // Calculate shipping (free over $50)
  const shippingCost = total >= 50 ? 0 : 5.99;

  // Calculate tax (example: 8%)
  const taxRate = 0.08;
  const taxAmount = total * taxRate;

  // Calculate order total
  const orderTotal = total + shippingCost + taxAmount;

  if (count === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-gray-200 p-4 sm:p-6",
          className,
        )}
      >
        <h2 className="mb-3 text-base font-medium text-gray-900 sm:mb-4 sm:text-lg">
          {t("cart.cartSummary")}
        </h2>
        <p className="mb-3 text-sm text-gray-500 sm:mb-4 sm:text-base">
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
      className={cn("rounded-lg border border-gray-200 p-4 sm:p-6", className)}
    >
      <h2 className="mb-3 text-base font-medium text-gray-900 sm:mb-4 sm:text-lg">
        {t("cart.cartSummary")}
      </h2>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between text-sm sm:text-base">
          <p>{t("cart.subtotal")}</p>
          <p className="font-medium">${total.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <p>{t("cart.shipping")}</p>
          <p className="font-medium">
            {shippingCost === 0
              ? t("cart.freeShipping")
              : `$${shippingCost.toFixed(2)}`}
          </p>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <p>{t("cart.tax")}</p>
          <p className="font-medium">${taxAmount.toFixed(2)}</p>
        </div>

        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <div className="flex justify-between text-sm font-medium sm:text-base">
            <p className="text-gray-900">{t("cart.orderTotal")}</p>
            <p className="text-primary">${orderTotal.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            {t("cart.shippingAndTaxes")}
          </p>
        </div>

        <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          <Button
            className="w-full text-sm sm:text-base"
            onClick={() => router.push("/checkout")}
          >
            {t("header.checkout")}
          </Button>

          <Button
            variant="outline"
            className="w-full text-sm sm:text-base"
            onClick={() => router.push("/browse")}
          >
            {t("cart.continueShopping")}
          </Button>
        </div>
      </div>
    </div>
  );
}
