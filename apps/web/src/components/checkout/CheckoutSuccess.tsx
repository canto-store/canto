import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
    <div className="bg-global mx-auto my-6 max-w-md space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm sm:p-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <h1 className="text-center text-xl font-bold text-gray-900 sm:text-3xl">
        Thank You for Shopping with Canto!
      </h1>

      <p className="text-center text-gray-600">Your order is confirmed.</p>
      <p className="text-center text-gray-600">
        Order Number : <strong>{order.orderCode}</strong>
      </p>

      <div className="rounded-lg bg-gray-100 p-3 text-left">
        <p className="text-sm text-gray-600">
          You’ve just supported an Egyptian brand, Every purchase helps local
          creators grow, and every product you choose tells a story made with
          Egyptian passion and pride.
        </p>
        <p className="font-arabic text-primary text-md text-center font-semibold">
          شكراً لشرائك محلي
        </p>
      </div>

      <Button className="w-full" onClick={() => router.push("/browse")}>
        {t("checkout.continueShopping")}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(`/orders`)}
      >
        {t("checkout.viewOrders")}
      </Button>
    </div>
  );
}
