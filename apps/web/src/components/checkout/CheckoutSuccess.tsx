import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
function formatDate(isoString: string): string {
  const date = new Date(isoString);

  // Handle invalid date strings
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

enum DeliveryStatus {
  DELIVERED = "DELIVERED",
  NOT_DELIVERED_YET = "NOT_DELIVERED_YET",
}

type Order = {
  id: number;
  orderCode: string;
  createdAt: string;
  deliveryStatus: DeliveryStatus;
};

export function CheckoutSuccess({ order }: { order: Order }) {
  const t = useTranslations();
  const router = useRouter();
  return (
    <div className="bg-global mx-auto my-32 max-w-md rounded-lg border border-gray-200 p-6 shadow-sm sm:p-8">
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
          <span className="font-medium">{order.orderCode}</span>
        </p>
        <p className="text-sm text-gray-600">
          {t("checkout.orderDate")}:{" "}
          <span className="font-medium">{formatDate(order.createdAt)}</span>
        </p>
        <p className="text-sm text-gray-600">
          {t("checkout.deliveryStatus.label")}:{" "}
          <span className="font-medium">
            {t(`checkout.deliveryStatus.not_delivered_yet`)}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <Button className="w-full" onClick={() => router.push("/browse")}>
          {t("checkout.continueShopping")}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/orders/${order.id}`)}
        >
          {t("checkout.viewOrder")}
        </Button>
      </div>
    </div>
  );
}
