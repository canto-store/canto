"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
}

export function CartSummary({ className }: CartSummaryProps) {
  const { price, count } = useCartStore();
  const t = useTranslations();
  const router = useRouter();

  if (count === 0) {
    return (
      <div
        className={cn(
          "h-auto rounded-lg border border-gray-200 p-3 sm:p-4",
          className,
        )}
      >
        <h2 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
          {t("cart.cartSummary")}
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
        {t("cart.cartSummary")}
      </h2>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <p>{t("cart.subtotal")}</p>
          <p className="font-medium">{price}</p>
        </div>

        <div className="border-t border-gray-200 pt-2 sm:pt-3">
          <div className="flex justify-between text-xs font-medium sm:text-sm">
            <p className="text-gray-900">{t("cart.orderTotal")}</p>
            <p className="text-primary">{price}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">{t("cart.shippingNote")}</p>
        </div>

        <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-2">
          <Button
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push("/checkout")}
            size="default"
          >
            {t("header.checkout")}
          </Button>

          <Button
            variant="outline"
            className="w-full text-xs sm:text-sm"
            onClick={() => router.push("/browse")}
          >
            {t("cart.continueShopping")}
          </Button>
        </div>
      </div>
    </div>
  );
}
