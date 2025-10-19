import { type Category } from "@/types/category";
import { CategoryCard } from "../common";

export function WebCategory({ categories }: { categories: Category[] }) {
  const rectangleCategories = categories.filter(
    (category) => category.aspect === "RECTANGLE",
  );
  const squareCategories = categories.filter(
    (category) => category.aspect === "SQUARE",
  );
  return (
    <section>
      <div className="container mx-auto flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {rectangleCategories.slice(0, 2).map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              variant="rectangle"
            />
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4">
          {squareCategories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {rectangleCategories.slice(2).map((category) => (
            <CategoryCard
              key={category.name}
              category={category}
              variant="rectangle"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
