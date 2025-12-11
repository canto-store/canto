import { useAllCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";
import { HomeCategoriesBannerSkeleton } from "./HomeCategoriesBannerSkeleton";
import { CategoryCard } from "../common/CategoryCard";

export function HomeCategoriesBanner() {
  const { data: categories, isLoading } = useAllCategories();
  useBrands();

  if (isLoading || !categories) {
    return <HomeCategoriesBannerSkeleton />;
  }

  const sortedCategories = categories.sort((a, b) =>
    a.coming_soon === b.coming_soon ? 0 : a.coming_soon ? 1 : -1,
  );

  return (
    <div className="scrollbar-hide container my-0 flex justify-between gap-2 overflow-x-auto py-2">
      {sortedCategories.map((category) => (
        <CategoryCard
          key={category.name}
          category={category}
          variant={category.aspect === "RECTANGLE" ? "rectangle" : "square"}
          type="banner"
          displaySubcategories={true}
        />
      ))}
    </div>
  );
}
