"use client";

import { OrderList } from "@/components/orders";
import { useGetMyOrders } from "@/lib/order";
import { ShoppingBag } from "lucide-react";

export default function Page() {
  const { data: orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="from-background to-muted/20 flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-b">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 h-16 w-16 rounded-full backdrop-blur-sm"></div>
          </div>
          <ShoppingBag className="text-primary relative z-10 mx-auto h-8 w-8 animate-pulse" />
        </div>
        <h3 className="mt-6 text-xl font-medium">Loading Orders</h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-center">
          We&apos;re collecting all your orders
        </p>
        <div className="mt-4 flex gap-1">
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.4s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.6s]"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* <OrderFilters onFilterChange={handleFilterChange} /> */}
      {orders && <OrderList orders={orders} />}
    </div>
  );
}
