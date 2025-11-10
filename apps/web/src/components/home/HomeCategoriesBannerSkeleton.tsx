import { Skeleton } from "@/components/ui/skeleton";

export function HomeCategoriesBannerSkeleton() {
  return (
    <section className="m-0 py-4">
      <div className="container mx-auto">
        <div className="flex gap-2 overflow-x-hidden lg:gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square h-[60px] rounded-lg lg:h-[102px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
