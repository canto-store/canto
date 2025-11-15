import React from "react";
import { useAllCategories } from "@/lib/categories";
import {
  Shirt,
  User,
  Baby,
  Footprints,
  Sparkles,
  Gem,
  Gift,
  Hand,
  SprayCan,
  Sofa,
  Tags,
} from "lucide-react";

export default function MobileCategoryDrawer() {
  const { data: categories, isLoading } = useAllCategories();

  if (isLoading || !categories) return null;

  // Map category slugs/names to icons
  const iconMap: Record<string, any> = {
    "mens-fashion": Shirt,
    "womens-fashion": User,
    kids: Baby,
    footwear: Footprints,
    "beauty-haircare": Sparkles,
    accessories: Gem,
    gifts: Gift,
    handmade: Hand,
    fragrances: SprayCan,
    furniture: Sofa,
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      {categories.map((category) => {
        const IconComponent = iconMap[category.slug] || Tags; // default icon

        return (
          <a
            href={`/browse?category=${category.slug}`}
            key={category.name}
            className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm transition hover:shadow-md active:scale-[0.98]"
            onClick={() => console.log(category.slug)}
          >
            <IconComponent className="h-4 w-4 text-black" strokeWidth={1.5} />
            <span className="font-sans text-sm font-light text-black uppercase">
              {category.name}
            </span>
          </a>
        );
      })}
    </div>
  );
}
