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
  const [isUpdating] = useState(false);

  // Handle continue shopping button click
  const handleContinueShopping = () => {
    router.push("/browse");
  };

  // If cart is empty, show empty state
  if (count === 0) {
    return (
      <PageShell title={t("cart.yourCart")}>
        <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="mb-6 rounded-full bg-gray-100 p-6 sm:mb-8 sm:p-8">
            <ShoppingCart className="h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />
          </div>
          <h2 className="mb-2 text-center text-xl font-bold sm:mb-3 sm:text-2xl">
            {t("cart.emptyCart")}
          </h2>
          <p className="mb-6 max-w-md text-center text-sm text-gray-500 sm:mb-8 sm:text-base">
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
      <div className="mb-4 sm:mb-8">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-600 sm:text-base"
          onClick={handleContinueShopping}
        >
          {isRTL ? (
            <>
              {t("cart.continueShopping")}
              <ArrowLeft className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
            </>
          ) : (
            <>
              <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
              {t("cart.continueShopping")}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg font-medium sm:text-xl">
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
                <div key={item.name} className="p-4 sm:p-6">
                  {/* Custom wrapper with additional spacing for both LTR and RTL */}
                  <div className="cart-item-wrapper">
                    <style jsx>{`
                      /* LTR styles */
                      .cart-item-wrapper :global(.ml-8) {
                        margin-left: 0 !important;
                      }

                      /* RTL styles */
                      .cart-item-wrapper :global(.mr-8) {
                        margin-right: 0 !important;
                      }

                      @media (min-width: 640px) {
                        /* LTR styles for small screens */
                        .cart-item-wrapper :global(.ml-8) {
                          margin-left: 2rem !important;
                        }

                        /* RTL styles for small screens */
                        .cart-item-wrapper :global(.mr-8) {
                          margin-right: 2rem !important;
                        }
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
        <div className="mt-4 sm:mt-0 lg:col-span-1">
          <CartSummary
            showCheckoutButton={true}
            showContinueShoppingButton={true}
          />
        </div>
      </div>
    </PageShell>
  );
}
