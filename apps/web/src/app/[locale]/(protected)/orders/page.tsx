"use client";

import { OrderList } from "@/components/orders";
import { useGetMyOrders } from "@/lib/order";

export default function Page() {
  const { data: orders } = useGetMyOrders();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* <OrderFilters onFilterChange={handleFilterChange} /> */}
      {orders && <OrderList orders={orders} />}
    </div>
  );
}
