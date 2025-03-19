"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "@/components/common";

export default function HomeLoading() {
  return (
    <>
      {/* Hero Slider Skeleton */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-2 w-10 rounded-full" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      {/* Category Grid Skeleton */}
      <SectionContainer background="background">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Featured Products Skeleton */}
      <SectionContainer background="white">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg shadow-sm">
              <Skeleton className="aspect-square w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-5 w-full" />
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="mb-4 h-6 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </>
  );
}
