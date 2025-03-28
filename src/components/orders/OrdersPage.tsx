"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { getUserOrders, reorderItems } from "@/lib/data/orders";
import { OrderList } from "./OrderList";
import { toast } from "sonner";

export default function OrdersPage() {
  // const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        const userOrders = getUserOrders("user1");
        // setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // const handleFilterChange = ({ status }: { status: OrderStatus | "All" }) => {
  //   const filtered = filterOrders(orders, status);
  //   setFilteredOrders(filtered);
  // };

  const handleReorder = (orderId: string) => {
    try {
      const success = reorderItems(orderId);
      if (success) {
        toast.success("Items added to cart successfully!");
      } else {
        toast.error("Failed to add items to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error reordering items:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* <OrderFilters onFilterChange={handleFilterChange} /> */}

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : (
        <OrderList orders={filteredOrders} onReorder={handleReorder} />
      )}
    </div>
  );
}
