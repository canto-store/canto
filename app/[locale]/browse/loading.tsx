"use client";

import { PageShell } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
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
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Category Quick Select Skeleton */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </div>
        </div>

        {/* Sort and Filter Bar Skeleton */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-2 h-px w-full" />
      </div>

      {/* View Tabs Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <Skeleton className="aspect-square w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-4 h-6 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
