import { Category } from "@/types/category";
import React from "react";
import { CategoryCard } from "../common";

export default function MobileCategory({
  categories,
}: {
  categories: Category[];
}) {
  // Define your layout pattern dynamically (number of items + variant)
  const layoutPattern = [
    { count: 1, variant: "rectangle" },
    { count: 1, variant: "rectangle" },
    { count: 2, variant: "square" },
    { count: 1, variant: "rectangle" },
    { count: 4, variant: "square" },
    { count: 1, variant: "rectangle" },
  ] as const;

  let currentIndex = 0;

  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid gap-4">
          {layoutPattern.map((group, i) => {
            const slice = categories.slice(
              currentIndex,
              currentIndex + group.count,
            );
            currentIndex += group.count;

            // If no categories left, stop rendering
            if (slice.length === 0) return null;

            // For multiple items, render in grid
            if (group.count > 1) {
              return (
                <div key={i} className="grid grid-cols-2 gap-4">
                  {slice.map((category) => (
                    <CategoryCard
                      key={category.name}
                      category={category}
                      variant={group.variant}
                    />
                  ))}
                </div>
              );
            }

            // For single items, render normally
            return (
              <CategoryCard
                key={slice[0].name}
                category={slice[0]}
                variant={group.variant}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
