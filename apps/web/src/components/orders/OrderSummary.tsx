"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn, formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  className?: string;
  totalPrice: number;
}

export function OrderSummary({ className, totalPrice }: OrderSummaryProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "h-auto rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4",
        className,
      )}
    >
      <h2 className="mb-2 text-base font-medium text-gray-900 sm:mb-3 sm:text-lg">
        {t("orders.orderSummary")}
      </h2>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between text-xs sm:text-sm">
          <p>{t("cart.subtotal")}</p>
          <p className="font-medium">{formatPrice(totalPrice)}</p>
        </div>

        <div className="border-t border-gray-200 pt-2 sm:pt-3">
          <div className="flex justify-between text-xs font-medium sm:text-sm">
            <p className="text-gray-900">{t("cart.orderTotal")}</p>
            <p className="text-primary">{formatPrice(totalPrice)}</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">{t("cart.shippingNote")}</p>
        </div>
      </div>
    </div>
  );
}
