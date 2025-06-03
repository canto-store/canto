import Image from "next/image";
import { Order, OrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatPrice } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

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
  const router = useRouter();

  const handleReorder = () => {
    onReorder(order.id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${statusColorMap[order.status]} w-fit text-xs font-medium`}
            >
              {order.status}
            </Badge>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(order.orderDate)}
            </p>
          </div>
        </div>
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
          <a onClick={() => router.push(`/orders/${order.id}`)}>
            <p className="mt-1 cursor-pointer text-xs text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              View Details
            </p>
          </a>
        </div>
        <Button className="ml-auto" size="sm" onClick={handleReorder}>
          Reorder
        </Button>
      </div>
    </div>
  );
}
