import Image from "next/image";
import { Order } from "@canto/types/order";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="flex flex-row items-center justify-between">
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(order.createdAt)}
        </p>
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
        <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">
          {order.items.length} items
        </p>
      </div>

      <div className="mt-4 flex">
        <div className="flex flex-col">
          <p className="text-sm font-medium">{formatPrice(order.totalPrice)}</p>
        </div>
      </div>
    </Link>
  );
}
