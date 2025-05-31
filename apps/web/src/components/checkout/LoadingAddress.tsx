import { Skeleton } from "../ui/skeleton";

export function LoadingAddress() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-20" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className="rounded-md bg-gray-50 p-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
