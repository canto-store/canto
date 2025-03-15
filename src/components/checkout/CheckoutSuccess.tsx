"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";

export function CheckoutSuccess() {
  const t = useTranslations();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("ORD-000000");
  const [orderDate, setOrderDate] = useState("2023-01-01");

  useEffect(() => {
    setOrderNumber("ORD-90129");
    setOrderDate("3/16/2025");
  }, []);

  return (
    <AppLayout>
      <div className="bg-global mx-auto max-w-md rounded-lg border border-gray-200 p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {t("checkout.orderConfirmed")}
        </h1>

        <p className="mb-6 text-gray-600">
          {t("checkout.orderConfirmationMessage")}
        </p>

        <div className="mb-6 rounded-md bg-gray-50 p-4 text-left">
          <h3 className="mb-2 font-medium text-gray-900">
            {t("checkout.orderDetails")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("checkout.orderNumber")}:{" "}
            <span className="font-medium">{orderNumber}</span>
          </p>
          <p className="text-sm text-gray-600">
            {t("checkout.orderDate")}:{" "}
            <span className="font-medium">{orderDate}</span>
          </p>
          <p className="text-sm text-gray-600">
            {t("checkout.paymentMethod")}:{" "}
            <span className="font-medium">{t("checkout.creditCard")}</span>
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => router.push("/browse")}>
            {t("checkout.continueShopping")}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/account/orders")}
          >
            {t("checkout.viewOrder")}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
