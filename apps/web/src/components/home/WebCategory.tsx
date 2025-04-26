import { type Category } from "@/lib/data/categories";
import { CategoryCard } from "../common";

export function WebCategory({ categories }: { categories: Category[] }) {
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-4">
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
