"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CartItemComponent, CartSummary } from "@/components/cart";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers";
export default function CartPage() {
  const { items, count } = useCart();
  const t = useTranslations();
  const router = useRouter();
  const [isUpdating] = useState(false);

  // Handle continue shopping button click
  const handleContinueShopping = () => {
    router.push("/browse");
  };

  // If cart is empty, show empty state
  if (count === 0) {
    return (
      <AppLayout theme="default">
        <div className="min-h-main flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="mb-6 rounded-full bg-gray-100 p-6 sm:mb-8 sm:p-8">
            <ShoppingCart className="h-14 w-14 text-gray-400 sm:h-16 sm:w-16" />
          </div>
          <h2 className="mb-2 text-center text-xl font-bold sm:text-2xl">
            {t("cart.emptyCart")}
          </h2>
          <p className="mb-4 max-w-md text-center text-sm text-gray-500 sm:mb-6 sm:text-base">
            {t("cart.yourCartIsEmpty")}
          </p>
          <Button size="lg" onClick={handleContinueShopping}>
            {t("cart.startShopping")}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout theme="default">
      <div className="min-h-main flex flex-col gap-5 px-4 py-7 pb-16 sm:gap-4 sm:px-6 sm:pb-20 lg:grid lg:grid-cols-3 lg:gap-6 lg:px-8">
        {/* Cart Items */}
        <div className="w-full lg:col-span-2">
          <div className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 p-3 sm:p-4">
              <h2 className="text-base font-medium sm:text-lg">
                {t("cart.itemsInCart", { count })}
              </h2>
            </div>

            <div
              className={cn(
                "min-h-[calc(100vh-350px)] divide-y divide-gray-200 overflow-y-auto",
                isUpdating && "opacity-50",
              )}
            >
              {items.map((item) => (
                <div key={item.name} className="p-3 sm:p-4">
                  {/* Custom wrapper with improved mobile spacing */}
                  <div className="cart-item-wrapper">
                    <style jsx>{`
                      /* Base styles for both LTR and RTL */
                      .cart-item-wrapper :global(.ml-0),
                      .cart-item-wrapper :global(.mr-0) {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                      }

                      /* Mobile-first approach */
                      .cart-item-wrapper :global(.cart-item-enhanced) {
                        width: 100%;
                      }

                      @media (min-width: 640px) {
                        /* LTR styles for small screens */
                        .cart-item-wrapper :global(.ml-0.sm\\:ml-8) {
                          margin-left: 2rem !important;
                        }

                        /* RTL styles for small screens */
                        .cart-item-wrapper :global(.mr-0.sm\\:mr-8) {
                          margin-right: 2rem !important;
                        }
                      }

                      @media (min-width: 768px) {
                        /* LTR styles for larger screens */
                        .cart-item-wrapper :global(.ml-0.sm\\:ml-8) {
                          margin-left: 3.5rem !important;
                        }

                        /* RTL styles for larger screens */
                        .cart-item-wrapper :global(.mr-0.sm\\:mr-8) {
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
        <div className="mt-3 w-full lg:mt-0">
          <CartSummary className="sticky top-4" />
        </div>
      </div>
    </AppLayout>
  );
}
