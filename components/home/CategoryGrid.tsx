import { cn } from "@/lib/utils";
import { type Category } from "@/lib/data/categories";
import { CategoryCard, SectionContainer } from "@/components/common";

interface CategoryGridProps {
  categories: Category[];
  title?: string;
  className?: string;
}

export function CategoryGrid({
  categories,
  title = "Shop by Category",
  className,
}: CategoryGridProps) {
  return (
    <SectionContainer title={title} background="background">
      <div
        className={cn(
          "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6",
          className,
        )}
      >
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </SectionContainer>
  );
}
