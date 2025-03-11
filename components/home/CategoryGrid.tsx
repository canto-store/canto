import { type Category } from "@/lib/data/categories";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { CategoryCard } from "../common";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
