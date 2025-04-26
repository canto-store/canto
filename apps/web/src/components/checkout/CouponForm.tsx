"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface CouponData {
  code: string;
  discountAmount: number;
  discountType: "percentage" | "fixed";
}

interface CouponFormProps {
  onApplyCoupon: (coupon: CouponData | null) => void;
  className?: string;
}

export function CouponForm({ onApplyCoupon, className }: CouponFormProps) {
  const t = useTranslations();
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  // Mock function to validate coupon - in a real app, this would call an API
  const validateCoupon = async (code: string): Promise<CouponData | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock coupon validation logic
    const mockCoupons: Record<string, CouponData> = {
      WELCOME10: {
        code: "WELCOME10",
        discountAmount: 10,
        discountType: "percentage",
      },
      FREESHIP: {
        code: "FREESHIP",
        discountAmount: 5,
        discountType: "fixed",
      },
      SUMMER25: {
        code: "SUMMER25",
        discountAmount: 25,
        discountType: "percentage",
      },
    };

    return mockCoupons[code.toUpperCase()] || null;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError(t("checkout.errors.emptyCoupon"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const validatedCoupon = await validateCoupon(couponCode);

      if (validatedCoupon) {
        setAppliedCoupon(validatedCoupon);
        onApplyCoupon(validatedCoupon);
      } else {
        setError(t("checkout.errors.invalidCoupon"));
        onApplyCoupon(null);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setError(t("checkout.errors.couponError"));
      onApplyCoupon(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setError(null);
    onApplyCoupon(null);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-base font-medium text-gray-900 sm:text-lg">
        {t("checkout.promoCode")}
      </h3>

      {appliedCoupon ? (
        <div className="space-y-3">
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="flex w-full items-center justify-between">
              <span>
                {appliedCoupon.discountType === "percentage"
                  ? t("checkout.percentageDiscount", {
                      amount: appliedCoupon.discountAmount,
                    })
                  : t("checkout.fixedDiscount", {
                      amount: appliedCoupon.discountAmount,
                    })}
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-green-700"
                onClick={handleRemoveCoupon}
              >
                {t("checkout.remove")}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder={t("checkout.enterPromoCode")}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={isSubmitting}
              className="whitespace-nowrap"
            >
              {isSubmitting ? t("common.applying") : t("checkout.apply")}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
