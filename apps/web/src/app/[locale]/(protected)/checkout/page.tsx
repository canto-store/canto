"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  ShippingAddressForm,
  CouponForm,
  CouponData,
  CheckoutSummary,
} from "@/components";
import { useBanner } from "@/providers";
import { useCartStore } from "@/lib/cart";
import { toast } from "sonner";
import { useGetAddress } from "@/lib/address";
import { AddressType } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(undefined);

  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);

  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { setShowBanner } = useBanner();

  const { data: userAddresses, isLoading: isLoadingUserAddresses } =
    useGetAddress();

  const handleApplyCoupon = (appliedCoupon: CouponData | null) => {
    setCoupon(appliedCoupon);
    setShowBanner(false);
    if (appliedCoupon) {
      toast.success(t("checkout.couponApplied"));
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
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
            {isLoadingUserAddresses ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-md bg-gray-50 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (userAddresses && userAddresses.length === 0) ||
              showShippingAddressForm ? (
              <ShippingAddressForm
                onClose={(addressId) => {
                  setShowShippingAddressForm(false);
                  setSelectedAddressId(addressId);
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {t("checkout.shippingAddress")}
                  </h2>
                  <Button
                    variant="outline"
                    className="text-sm font-medium"
                    onClick={() => setShowShippingAddressForm(true)}
                  >
                    {t("checkout.add")}
                  </Button>
                </div>
                {userAddresses &&
                  userAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`cursor-pointer rounded-md p-3 text-sm transition-colors ${
                        selectedAddressId === address.id
                          ? "bg-primary/10 border-primary border-1"
                          : "bg-gray-50"
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1">
                            <p className="font-bold">{address.address_label}</p>
                            <p className="text-xs text-gray-500">
                              {address.type}
                            </p>
                            {address.type === AddressType.HOUSE && (
                              <p>
                                {address.building_number}, {address.street_name}
                              </p>
                            )}
                            {address.type === AddressType.APARTMENT && (
                              <p>
                                {address.street_name},{" "}
                                {address.apartment_number}, {address.floor}
                              </p>
                            )}
                            {address.type === AddressType.OFFICE && (
                              <p>
                                {address.office_number} {address.company_name}
                              </p>
                            )}

                            <p>
                              {address.area}, {address.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
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
            shippingAddress={
              userAddresses?.find(
                (address) => address.id === selectedAddressId,
              ) ?? null
            }
            onPlaceOrder={handlePlaceOrder}
            isLoading={isProcessingOrder}
          />
        </div>
      </div>
    </div>
  );
}
