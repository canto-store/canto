import { Category } from "@/types/category";
import React from "react";
import { CategoryCard } from "../common";

export default function MobileCategory({
  categories,
}: {
  categories: Category[];
}) {
  const rectangleCategories = categories.filter(
    (category) => category.aspect === "RECTANGLE",
  );
  const squareCategories = categories.filter(
    (category) => category.aspect === "SQUARE",
  );

  return (
    <div className="scrollbar-hide container my-0 flex justify-between gap-2 overflow-x-auto py-2">
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
