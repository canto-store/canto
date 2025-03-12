import { useRouter } from "@/i18n/navigation";
import { type Category } from "@/lib/data/categories";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const getTranslatedCategoryName = (category: Category) => {
    if (category.translationKey) {
      try {
        return t(category.translationKey);
      } catch {
        return category.name;
      }
    }
    return category.name;
  };
  const handleCategoryClick = (category: Category) => {
    router.push(`/browse?category=${encodeURIComponent(category.name)}`);
  };
  return (
    <button
      key={category.name}
      onClick={() => handleCategoryClick(category)}
      className="group overflow-hidden rounded-lg hover:cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={category.image}
          alt={getTranslatedCategoryName(category)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={300}
          height={300}
          sizes="(max-width: 768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-center text-sm font-semibold text-white sm:text-base">
            {getTranslatedCategoryName(category)}
          </span>
        </div>
      </div>
    </button>
  );
}
