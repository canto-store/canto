"use client";

import { OrderCard } from "@/components/orders";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "@/i18n/navigation";
import { useGetMyOrders } from "@/lib/order";
import { Suspense, useState } from "react";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);

  const take = 6;
  const skip = (currentPage - 1) * take;

  const { data } = useGetMyOrders({ take, skip });
  const router = useRouter();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {data.orders.length === 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-center">
          <h3 className="text-lg font-medium">No orders yet</h3>
          <p className="text-sm text-gray-500">
            When you place orders, they will appear here.
          </p>
          <Button
            onClick={() => {
              router.push("/browse");
            }}
            variant="default"
          >
            Shop Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data.orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={data.totalPages}
          />
        </div>
      )}
    </div>
  );
}
