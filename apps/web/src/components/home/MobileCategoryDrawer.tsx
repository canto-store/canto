import React from "react";
import { useAllCategories } from "@/lib/categories";
import { Accordion, AccordionItem } from "@heroui/react";
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
  Flame,
  Wine,
  UtensilsCrossed,
  ShoppingBag,
  Circle,
  Ear,
  Watch,
} from "lucide-react";

export default function MobileCategoryDrawer() {
  const { data: categories, isLoading } = useAllCategories();

  if (isLoading || !categories) return null;

  // Map category slugs/names to icons
  const categoryIconMap: Record<string, any> = {
    "mens-fashion": Shirt,
    "womens-fashion": User,
    kids: Baby,
    footwear: Footprints,
    "beauty-haircare": Sparkles,
    "beauty-skin-care": Sparkles,
    accessories: Gem,
    "jewelry-accessories": Gem,
    gifts: Gift,
    handmade: Hand,
    fragrances: SprayCan,
    furniture: Sofa,
  };

  // Map subcategory slugs to icons
  const subcategoryIconMap: Record<string, any> = {
    candles: Flame,
    pottery: Wine,
    kitchen: UtensilsCrossed,
    belts: ShoppingBag,
    necklaces: Gem,
    rings: Circle,
    earrings: Ear,
    "skin-care": Sparkles,
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      {categories.map((category) => {
        const IconComponent = categoryIconMap[category.slug] || Tags;
        const hasSubcategories =
          category.children && category.children.length > 0;

        // If category has no subcategories OR is coming soon, render as a simple link
        if (!hasSubcategories || category.coming_soon) {
          return (
            <a
              key={category.id}
              href={category.coming_soon ? undefined : `/browse?category=${category.slug}`}
              className={`flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm transition hover:shadow-md ${
                !category.coming_soon
                  ? "cursor-pointer active:scale-[0.98]"
                  : "cursor-default"
              } ${category.coming_soon ? "relative overflow-hidden" : ""}`}
              onClick={(e) => {
                if (category.coming_soon) {
                  e.preventDefault();
                }
              }}
            >
              {category.coming_soon && (
                <span className="absolute top-1/2 right-0.5 z-10 -translate-y-1/2 rounded-full bg-black/70 px-1 py-1 text-[8px] font-semibold tracking-wide text-white uppercase shadow-sm backdrop-blur-sm">
                  Coming Soon
                </span>
              )}
              <div className="flex items-center gap-2">
                <IconComponent
                  className="h-4 w-4 text-black"
                  strokeWidth={1.5}
                />
                <span className="font-sans text-sm font-light text-black uppercase">
                  {category.name}
                </span>
              </div>
            </a>
          );
        }

        // If category has subcategories and is not coming soon, render as an accordion
        return (
          <Accordion
            key={category.id}
            className="px-0"
            itemClasses={{
              base: "px-0",
              title: "font-sans text-sm font-light text-black uppercase",
              trigger: "px-2 py-1 rounded-lg border border-gray-300 bg-white shadow-sm hover:shadow-md data-[hover=true]:bg-white",
              content: "px-0 pb-1",
            }}
          >
            <AccordionItem
              key={category.id}
              aria-label={category.name}
              title={
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-black" strokeWidth={1.5} />
                  <span>{category.name}</span>
                </div>
              }
            >
              <div className="ml-6 flex flex-col gap-1 pt-1">
                {category.children!.map((subcategory) => {
                  const SubcategoryIcon = subcategoryIconMap[subcategory.slug] || Tags;

                  return (
                    <a
                      href={`/browse?category=${subcategory.slug}`}
                      key={subcategory.id}
                      className={`flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 shadow-sm transition hover:shadow-md active:scale-[0.98] ${
                        subcategory.coming_soon ? "relative overflow-hidden" : ""
                      }`}
                      onClick={(e) => {
                        if (subcategory.coming_soon) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {subcategory.coming_soon && (
                        <span className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-black/70 px-1 py-1 text-[8px] font-semibold tracking-wide text-white uppercase shadow-sm backdrop-blur-sm">
                          Coming Soon
                        </span>
                      )}
                      <SubcategoryIcon
                        className="h-3 w-3 text-gray-600"
                        strokeWidth={1.5}
                      />
                      <span className="font-sans text-xs font-light text-gray-700">
                        {subcategory.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
