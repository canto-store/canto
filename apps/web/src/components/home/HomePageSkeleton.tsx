import { HomeProductsSkeleton } from "./HomeProductsSkeleton";

export function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      <HomeProductsSkeleton productCount={5} />
      <HomeProductsSkeleton productCount={5} />
      <HomeProductsSkeleton productCount={5} />
    </div>
  );
}
