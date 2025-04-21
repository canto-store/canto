"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  ShippingAddressForm,
  ShippingAddress,
  CouponForm,
  CouponData,
  CheckoutSummary,
} from "@/components";
import { useBanner, useCart } from "@/providers";
import { toast } from "sonner";

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const { clearCart } = useCart();

  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { setShowBanner } = useBanner();

  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    toast.success(t("checkout.addressSaved"));
  };

  const handleApplyCoupon = (appliedCoupon: CouponData | null) => {
    setCoupon(appliedCoupon);
    setShowBanner(false);
    if (appliedCoupon) {
      toast.success(t("checkout.couponApplied"));
    }
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      toast.error(t("checkout.errors.noShippingAddress"));
      return;
    }

    setIsProcessingOrder(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      clearCart();
      toast.success(t("checkout.orderSuccess"));
      router.push("/checkout/success");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(t("checkout.errors.orderFailed"));
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        {t("checkout.title")}
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping Address Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            {shippingAddress ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {t("checkout.shippingAddress")}
                  </h2>
                  <button
                    onClick={() => setShippingAddress(null)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {t("checkout.add")}
                  </button>
                </div>

                <div className="rounded-md bg-gray-50 p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{shippingAddress.addressLabel}</p>
                      <p>
                        {shippingAddress.apartmentNumber}{" "}
                        {shippingAddress.street}
                      </p>
                      <p>
                        {shippingAddress.area}, {shippingAddress.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setShippingAddress(null)}
                      className="text-primary hover:text-primary/80 ml-2 text-sm font-medium"
                    >
                      {t("checkout.edit")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ShippingAddressForm onAddressSubmit={handleAddressSubmit} />
            )}
          </div>

          {/* Coupon Form */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <CouponForm onApplyCoupon={handleApplyCoupon} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            coupon={coupon}
            shippingAddress={shippingAddress}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isProcessingOrder}
          />
        </div>
      </div>
    </div>
  );
}
