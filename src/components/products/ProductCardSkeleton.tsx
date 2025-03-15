import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export function ProductCardSkeleton() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div
      className="group relative flex h-auto flex-col overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative aspect-square w-full animate-pulse overflow-hidden bg-gray-200">
        {/* Image skeleton */}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Product name skeleton */}
          <div
            className={cn(
              "mb-2 h-6 w-full animate-pulse rounded bg-gray-200",
              isRTL ? "text-right" : "text-left",
            )}
          />
          <div
            className={cn(
              "mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200",
              isRTL ? "text-right" : "text-left",
            )}
          />

          {/* Brand name skeleton */}
          <div
            className={cn(
              "mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200",
              isRTL ? "text-right" : "text-left",
            )}
          />
        </div>
        <div>
          {/* Price skeleton */}
          <div
            className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse",
            )}
          >
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
          </div>

          {/* Buttons skeleton */}
          <div className={cn("mt-3 flex gap-2", isRTL && "flex-row-reverse")}>
            <div className="h-9 flex-1 animate-pulse rounded bg-gray-300" />
            <div className="h-9 flex-1 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
