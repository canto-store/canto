"use client";

import { useState } from "react";
import Image from "next/image";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { OrderTrackingDetails } from "./OrderTrackingDetails";

const statusColorMap: Record<OrderStatus, string> = {
  Processing: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  Shipped: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  Delivered: "bg-green-100 text-green-800 hover:bg-green-200",
  Cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
};

type OrderCardProps = {
  order: Order;
  onReorder: (orderId: string) => void;
};

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const handleReorder = () => {
    onReorder(order.id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Order #{order.id.slice(-6)}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Placed on {formatDate(order.orderDate)}
          </p>
        </div>
        <Badge
          className={`${statusColorMap[order.status]} w-fit text-xs font-medium`}
        >
          {order.status}
        </Badge>
      </div>

      <Separator className="my-3" />

      <div className="mt-2 flex flex-wrap gap-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="relative h-14 w-14 overflow-hidden rounded-md"
          >
            <Image
              src={item.thumbnailUrl}
              alt={item.productName}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ))}
        {order.items.length > 4 && (
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-gray-100 text-sm font-medium dark:bg-gray-800">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">Total: EGP{order.totalPrice.toFixed(2)}</p>
        <div className="flex w-full justify-between">
          <Button variant="outline" className="w-25" onClick={handleReorder}>
            Reorder
          </Button>
          {order.status !== "Delivered" && order.status !== "Cancelled" && (
            <Button
              className="w-25"
              onClick={() => setIsTrackingOpen(!isTrackingOpen)}
            >
              {isTrackingOpen ? "Hide Tracking" : "Track Order"}
            </Button>
          )}
        </div>
      </div>

      {isTrackingOpen && order.trackingInfo && (
        <div className="mt-4">
          <OrderTrackingDetails trackingInfo={order.trackingInfo} />
        </div>
      )}
    </div>
  );
}
