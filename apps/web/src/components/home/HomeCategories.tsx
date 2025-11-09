import { WebCategory } from "./WebCategory";
import MobileCategory from "./MobileCategory";
import { useAllCategories } from "@/lib/categories";
import { HomeCategoriesSkeleton } from "./HomeCategoriesSkeleton";
import { useBrands } from "@/lib/brand";

export function HomeCategories() {
  const { data: categories, isLoading } = useAllCategories();
  useBrands();

  if (isLoading || !categories) {
    return <HomeCategoriesSkeleton />;
  }

  return (
    <>
      <div className="md:hidden">
        <MobileCategory categories={categories} />
      </div>
      <div className="hidden md:block">
        <WebCategory categories={categories} />
      </div>
    </>
  );
}
