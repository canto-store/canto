"use client";

import { useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { OrderItemComponent } from "@/components/orders/Ordertem";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { useDeleteOrder, useGetSingleOrder } from "@/lib/order";
import { OrderAddress } from "@/components/orders/OrderAddress";
import { useParams } from "next/navigation";
import OrderNotFound from "@/components/orders/OrderNotFound";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export default function SingleOrderPage() {
  const params = useParams();
  const orderId = params.id ? Number(params.id) : undefined;

  if (!orderId) return <OrderNotFound />;

  const { data: order, isLoading } = useGetSingleOrder(orderId);

  const { mutateAsync: deleteOrder } = useDeleteOrder();

  if (!order) return <OrderNotFound />;

  const count = order?.items.length ?? 0;
  const t = useTranslations();
  const [isUpdating] = useState(false);

  const handleDeleteOrder = async () => {
    if (!orderId) return;

    await deleteOrder(orderId).then((res) => {
      toast.success(res);
    });
  };

  if (isLoading) {
    return (
      <div className="from-background to-muted/20 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center bg-gradient-to-b">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 h-16 w-16 rounded-full backdrop-blur-sm"></div>
          </div>
          <ShoppingCartIcon className="text-primary relative z-10 mx-auto h-8 w-8 animate-pulse" />
        </div>
        <h3 className="mt-6 text-xl font-medium">Loading Order Details</h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-center">
          We&apos;re collecting all your order items
        </p>
        <div className="mt-4 flex gap-1">
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.1s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.3s]"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Order #{order.orderCode}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {/* Order #{order.code} • Created on {formatDate(order.createdAt)} */}
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
          {order.status === "PROCESSING" && (
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Cancel Order
            </Button>
          )}
        </div>

        {/* Optional: status badge */}
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
              order.status === "PROCESSING" && "bg-amber-100 text-amber-800",
              order.status === "SHIPPED" && "bg-blue-100 text-blue-800",
              order.status === "OUT_FOR_DELIVERY" &&
                "bg-orange-100 text-orange-800",
              order.status === "DELIVERED" && "bg-green-100 text-green-800",
              order.status === "CANCELLED" && "bg-red-100 text-red-800",
              order.status === "RETURNED" && "bg-purple-100 text-purple-800",
              order.status === "RETURN_REQUESTED" &&
                "bg-yellow-100 text-yellow-800",
            )}
          >
            {order.status.split("_").join(" ").toLowerCase()}
          </span>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-5 px-4 py-7 pb-16 sm:gap-4 sm:px-6 sm:pb-20 md:min-h-[calc(100vh-4.5rem)] lg:grid lg:grid-cols-3 lg:gap-6 lg:px-8">
        {/* Order Items */}
        <div className="w-full lg:col-span-2">
          <div className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 p-3 sm:p-4">
              <h2 className="text-base font-medium sm:text-lg">
                {t("orders.itemsInCart", { count })}
              </h2>
            </div>

            <div
              className={cn(
                "divide-y divide-gray-200 overflow-y-auto",
                isUpdating && "opacity-50",
              )}
            >
              {order.items?.map((item) => (
                <div key={item.id} className="p-3 sm:p-4">
                  <OrderItemComponent
                    item={item}
                    canReturn={order.status === "DELIVERED"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:gap-4 lg:gap-6">
          {/* Order Address */}
          <div className="mt-3 w-full lg:mt-0">
            <OrderAddress className="sticky top-4" address={order.address!} />
          </div>

          {/* Order Summary */}
          <div className="mt-3 w-full lg:mt-0">
            <OrderSummary
              className="sticky top-4"
              totalPrice={order.totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
