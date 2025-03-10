import { type Category } from "@/lib/data/categories";
import { useTranslations } from "next-intl";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const t = useTranslations();

  // Get translated category name
  const getTranslatedCategoryName = (category: Category) => {
    if (category.translationKey) {
      try {
        return t(category.translationKey);
      } catch (error) {
        // Fallback to original name if translation is not available
        return category.name;
      }
    }
    return category.name;
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href={`/browse?category=${encodeURIComponent(category.name.toLowerCase())}`}
              className="group overflow-hidden rounded-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={getTranslatedCategoryName(category)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-center text-sm font-semibold text-white sm:text-base">
                    {getTranslatedCategoryName(category)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
