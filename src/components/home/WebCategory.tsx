import { type Category } from "@/lib/data/categories";
import { CategoryCard } from "../common";

export function WebCategory({ categories }: { categories: Category[] }) {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
