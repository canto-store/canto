"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ShippingAddressForm,
  CouponForm,
  CouponData,
  CheckoutSummary,
} from "@/components";
import { useBanner } from "@/providers";
import { toast } from "sonner";
import { useGetAddress } from "@/lib/address";
import { useCreateOrder } from "@/lib/order";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingAddress } from "@/components/checkout/LoadingAddress";
import { UserAddress } from "@/components/checkout/UserAddress";
import { CheckoutSuccess } from "@/components/checkout/CheckoutSuccess";

export default function Page() {
  const t = useTranslations();
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | undefined
  >(undefined);

  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);

  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const { setShowBanner } = useBanner();

  const queryClient = useQueryClient();

  const { data: userAddresses, isLoading: isLoadingUserAddresses } =
    useGetAddress();

  const {
    mutateAsync: createOrder,
    isPending: isProcessingOrder,
    data: order,
    isSuccess: isOrderCreated,
  } = useCreateOrder();

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
    await createOrder(selectedAddressId).then(() => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    });
  };

  if (isOrderCreated && order) {
    return <CheckoutSuccess order={order} />;
  }

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
              <LoadingAddress />
            ) : (userAddresses && userAddresses.length === 0) ||
              showShippingAddressForm ? (
              <ShippingAddressForm
                onCloseAction={(addressId) => {
                  setShowShippingAddressForm(false);
                  setSelectedAddressId(addressId);
                }}
              />
            ) : (
              <UserAddress
                userAddresses={userAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                setShowShippingAddressForm={setShowShippingAddressForm}
              />
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
