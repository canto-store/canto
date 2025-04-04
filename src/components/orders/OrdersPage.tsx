"use client";

import { useState, useEffect } from "react";
import { Order } from "@/types";
import { getUserOrders, reorderItems } from "@/lib/data/orders";
import { OrderList } from "./OrderList";
import { toast } from "sonner";

export default function OrdersPage() {
  // const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = getUserOrders("user1");
        // setOrders(userOrders);
        setFilteredOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again.");
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
      <OrderList orders={filteredOrders} onReorder={handleReorder} />
    </div>
  );
}
