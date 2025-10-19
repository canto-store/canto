import { Category } from "@/types/category";
import React from "react";
import { CategoryCard } from "../common";

export default function MobileCategory({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid gap-4">
          <CategoryCard
            key={categories[0].name}
            category={categories[0]}
            variant="rectangle"
          />
          <CategoryCard
            key={categories[1].name}
            category={categories[1]}
            variant="rectangle"
          />
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(2, 4).map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                variant="square"
              />
            ))}
          </div>
          <CategoryCard
            key={categories[4].name}
            category={categories[4]}
            variant="rectangle"
          />
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(5, 9).map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                variant="square"
              />
            ))}
          </div>
          <CategoryCard
            key={categories[9].name}
            category={categories[9]}
            variant="rectangle"
          />
        </div>
      </div>
    </section>
  );
}
