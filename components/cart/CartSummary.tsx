"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
  showCheckoutButton?: boolean;
  showContinueShoppingButton?: boolean;
}

export function CartSummary({
  className,
  showCheckoutButton = true,
  showContinueShoppingButton = false,
}: CartSummaryProps) {
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
          "rounded-lg border border-gray-200 bg-white p-6",
          className,
        )}
      >
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          {t("cart.cartSummary")}
        </h2>
        <p className="mb-4 text-gray-500">{t("cart.emptyCart")}</p>
        <Button className="w-full" onClick={() => router.push("/browse")}>
          {t("cart.startShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6",
        className,
      )}
    >
      <h2 className="mb-4 text-lg font-medium text-gray-900">
        {t("cart.cartSummary")}
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between text-base">
          <p>{t("cart.subtotal")}</p>
          <p className="font-medium">${total.toFixed(2)}</p>
        </div>

        <div className="flex justify-between text-base">
          <p>{t("cart.shipping")}</p>
          <p className="font-medium">
            {shippingCost === 0
              ? t("cart.freeShipping")
              : `$${shippingCost.toFixed(2)}`}
          </p>
        </div>

        <div className="flex justify-between text-base">
          <p>{t("cart.tax")}</p>
          <p className="font-medium">${taxAmount.toFixed(2)}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-base font-medium">
            <p className="text-gray-900">{t("cart.orderTotal")}</p>
            <p className="text-primary">${orderTotal.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {t("cart.shippingAndTaxes")}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {showCheckoutButton && (
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              {t("header.checkout")}
            </Button>
          )}

          {showContinueShoppingButton && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/browse")}
            >
              {t("cart.continueShopping")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
