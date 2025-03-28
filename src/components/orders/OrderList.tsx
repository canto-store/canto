import { Order } from "@/types";
import { OrderCard } from "./OrderCard";

type OrderListProps = {
  orders: Order[];
  onReorder: (orderId: string) => void;
};

export function OrderList({ orders, onReorder }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          When you place orders, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onReorder={onReorder} />
      ))}
    </div>
  );
}
