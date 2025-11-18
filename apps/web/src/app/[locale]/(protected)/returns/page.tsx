"use client";

import { Pagination } from "@/components/ui/pagination";
import { useGetMyReturns } from "@/lib/return";
import { useState } from "react";
import { ReturnCard } from "@/components/returns/RetunCard";

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);

  const take = 6;
  const skip = (currentPage - 1) * take;

  const { data } = useGetMyReturns(take, skip);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 py-6">
      {data.length === 0 ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-center">
          <h3 className="text-lg font-medium">No return requests yet</h3>
          <p className="text-sm text-gray-500">
            When you create return requests, they will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {data.map((returnItem) => (
              <ReturnCard key={returnItem.id} returnItem={returnItem} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={1}
          />
        </div>
      )}
    </div>
  );
}
