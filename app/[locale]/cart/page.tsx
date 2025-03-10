"use client";

import { useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { PageShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCart, CartItemComponent, CartSummary } from "@/components/cart";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, count } = useCart();
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle continue shopping button click
  const handleContinueShopping = () => {
    router.push("/browse");
  };

  // If cart is empty, show empty state
  if (count === 0) {
    return (
      <PageShell title={t("cart.yourCart")}>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-8 rounded-full bg-gray-100 p-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold">{t("cart.emptyCart")}</h2>
          <p className="mb-8 max-w-md text-center text-gray-500">
            {t("cart.yourCartIsEmpty")}
          </p>
          <Button size="lg" onClick={handleContinueShopping}>
            {t("cart.startShopping")}
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("cart.yourCart")}>
      <div className="mb-8">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600"
          onClick={handleContinueShopping}
        >
          {isRTL ? (
            <>
              {t("cart.continueShopping")}
              <ArrowLeft className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("cart.continueShopping")}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-medium">
                {t("cart.itemsInCart", { count })}
              </h2>
            </div>

            <div
              className={cn(
                "divide-y divide-gray-200",
                isUpdating && "opacity-50",
              )}
            >
              {items.map((item) => (
                <div key={item.name} className="p-6">
                  {/* Custom wrapper with additional spacing for both LTR and RTL */}
                  <div className="cart-item-wrapper">
                    <style jsx>{`
                      /* LTR styles */
                      .cart-item-wrapper :global(.ml-8) {
                        margin-left: 2.5rem !important;
                      }

                      /* RTL styles */
                      .cart-item-wrapper :global(.mr-8) {
                        margin-right: 2.5rem !important;
                      }

                      @media (min-width: 768px) {
                        /* LTR styles for larger screens */
                        .cart-item-wrapper :global(.ml-8) {
                          margin-left: 3.5rem !important;
                        }

                        /* RTL styles for larger screens */
                        .cart-item-wrapper :global(.mr-8) {
                          margin-right: 3.5rem !important;
                        }
                      }
                    `}</style>
                    <CartItemComponent
                      item={item}
                      showControls={true}
                      className="cart-item-enhanced"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            showCheckoutButton={true}
            showContinueShoppingButton={true}
          />
        </div>
      </div>
    </PageShell>
  );
}
