import { Category } from "@/types/category";
import { CategoryCard } from "../common";

export default function MobileCategory({
  categories,
}: {
  categories: Category[];
}) {
  const squares = categories
    .filter((c) => c.aspect === "SQUARE")
    .sort(
      (a, b) =>
        (a.coming_soon === true ? 1 : 0) - (b.coming_soon === true ? 1 : 0),
    );
  const rectangles = categories
    .filter((c) => c.aspect === "RECTANGLE")
    .sort(
      (a, b) =>
        (a.coming_soon === true ? 1 : 0) - (b.coming_soon === true ? 1 : 0),
    );
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid gap-4">
          <CategoryCard
            key={rectangles[0].name}
            category={rectangles[0]}
            variant="rectangle"
          />
          <div className="grid grid-cols-2 gap-4">
            {squares.slice(0, 2).map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                variant="square"
              />
            ))}
          </div>
          <CategoryCard
            key={rectangles[1].name}
            category={rectangles[1]}
            variant="rectangle"
          />
          <CategoryCard
            key={rectangles[2].name}
            category={rectangles[2]}
            variant="rectangle"
          />
          <div className="grid grid-cols-2 gap-4">
            {squares.slice(2, 4).map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                variant="square"
              />
            ))}
          </div>
          <CategoryCard
            key={rectangles[3].name}
            category={rectangles[3]}
            variant="rectangle"
          />
          <div className="grid grid-cols-2 gap-4">
            <CategoryCard
              key={squares[4].name}
              category={squares[4]}
              variant="square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
