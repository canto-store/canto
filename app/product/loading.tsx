"use client";

import { PageShell } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <PageShell>
      {/* Page Header Skeleton */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Search and Filters Skeleton */}
      <div className="mb-8">
        <div className="mb-4 flex gap-2">
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="mb-6">
        <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-gray-200" />
            <div className="p-4">
              <div className="mb-2 h-6 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
