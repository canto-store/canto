"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useCart, CartSummary } from "@/components/cart";

export default function CheckoutPage() {
  const { count } = useCart();
  const t = useTranslations();
  const router = useRouter();

  const handleBackToCart = () => {
    router.push("/cart");
  };

  if (count === 0) {
    return (
      <AppLayout theme="default">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-8 max-w-md text-center text-gray-500">
            {t("cart.emptyCart")}
          </p>
          <Button size="lg" onClick={handleBackToCart}>
            {t("products.back")}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout theme="default">
      <div className="h-main grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-medium">{t("header.checkout")}</h2>

            {/* Placeholder for checkout form */}
            <div className="space-y-6 py-4">
              <p className="text-gray-500">
                This is a placeholder for the checkout form. In a real
                application, this would include:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-gray-500">
                <li>Shipping address form</li>
                <li>Payment method selection</li>
                <li>Delivery options</li>
                <li>Order notes</li>
              </ul>
            </div>
          </div>
        </div>

        <CartSummary />
      </div>
    </AppLayout>
  );
}
