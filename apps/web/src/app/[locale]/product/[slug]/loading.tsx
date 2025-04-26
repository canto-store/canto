"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <>
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Product Detail */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image Skeleton */}
        <Skeleton className="aspect-square rounded-lg" />

        {/* Product Info Skeleton */}
        <div>
          <Skeleton className="mb-2 h-10 w-3/4" />
          <Skeleton className="mb-4 h-6 w-1/2" />

          {/* Rating Skeleton */}
          <div className="mb-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-5" />
            ))}
            <Skeleton className="ml-2 h-4 w-20" />
          </div>

          <Skeleton className="mb-6 h-8 w-24" />

          {/* Description Skeleton */}
          <div className="mb-6">
            <Skeleton className="mb-2 h-6 w-24" />
            <Skeleton className="h-20" />
          </div>

          {/* Size Selection Skeleton */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-10" />
              ))}
            </div>
          </div>

          {/* Color Selection Skeleton */}
          <div className="mb-6">
            <Skeleton className="mb-2 h-6 w-16" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          </div>

          {/* Quantity Skeleton */}
          <div className="mb-6">
            <Skeleton className="mb-2 h-6 w-20" />
            <div className="flex w-32 items-center">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="mx-2 h-6 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          {/* Add to Cart Skeleton */}
          <div className="mb-6 flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>

          {/* Additional Info Skeleton */}
          <div className="rounded-lg border p-4">
            <Skeleton className="mb-2 h-4 w-20" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-sm">
              <Skeleton className="aspect-square" />
              <div className="p-4">
                <Skeleton className="mb-2 h-6" />
                <Skeleton className="mb-2 h-4 w-24" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
