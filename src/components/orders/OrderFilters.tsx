"use client";

import { useState } from "react";
import { OrderStatus } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderFiltersProps = {
  onFilterChange: (filters: { status: OrderStatus | "All" }) => void;
};

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [status, setStatus] = useState<OrderStatus | "All">("All");

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus | "All";
    setStatus(newStatus);
    onFilterChange({ status: newStatus });
  };
  return (
    <div className="mb-6 space-y-4">
      <Tabs
        defaultValue="All"
        value={status}
        onValueChange={handleStatusChange}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-auto rounded-md bg-gray-100 p-1 dark:bg-gray-800">
          <TabsTrigger
            value="All"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="Processing"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-amber-400"
          >
            Processing
          </TabsTrigger>
          <TabsTrigger
            value="Shipped"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
          >
            Shipped
          </TabsTrigger>
          <TabsTrigger
            value="Delivered"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400"
          >
            Delivered
          </TabsTrigger>
          <TabsTrigger
            value="Cancelled"
            className="rounded-md data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-red-400"
          >
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
