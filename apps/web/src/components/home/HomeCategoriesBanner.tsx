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

  const rectangleCategories = categories.filter(
    (category) => category.aspect === "RECTANGLE",
  );
  const squareCategories = categories.filter(
    (category) => category.aspect === "SQUARE",
  );

  return (
    <div className="scrollbar-hide container my-0 flex justify-between gap-2 overflow-x-auto py-4 lg:gap-4">
      {rectangleCategories.slice(0, 2).map((category) => (
        <CategoryCard
          key={category.name}
          category={category}
          variant="rectangle"
          type="banner"
        />
      ))}

      {squareCategories.map((category) => (
        <CategoryCard key={category.name} category={category} type="banner" />
      ))}
      {rectangleCategories.slice(2).map((category) => (
        <CategoryCard
          key={category.name}
          category={category}
          variant="rectangle"
          type="banner"
        />
      ))}
    </div>
  );
}
