"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function CheckoutSuccess() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
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
            <span className="font-medium">
              ORD-{Math.floor(100000 + Math.random() * 900000)}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            {t("checkout.orderDate")}:{" "}
            <span className="font-medium">
              {new Date().toLocaleDateString()}
            </span>
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
    </div>
  );
}
