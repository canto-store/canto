import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "react-haiku";

export function HomeCategoriesSkeleton() {
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  if (isMobile) {
    return (
      <section className="py-8">
        <div className="px-4">
          <div className="flex gap-4 overflow-x-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="min-w-24 flex-shrink-0">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="mt-2 h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
