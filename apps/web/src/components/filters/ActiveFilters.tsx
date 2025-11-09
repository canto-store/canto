import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";
import { type PriceRange } from "@/lib/data";
import { useBrands } from "@/lib/brand";
import { useCategories } from "@/lib/categories";

interface ActiveFiltersProps {
  hasActiveFilters: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string[] | undefined;
  setSelectedBrand: (brand: string[] | undefined) => void;
  selectedPriceRange: PriceRange;
  defaultPriceRange: PriceRange;
  setSelectedPriceRange: (range: PriceRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  translations: {
    filters: string;
  };
}

export function ActiveFilters({
  hasActiveFilters,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedPriceRange,
  defaultPriceRange,
  setSelectedPriceRange,
  searchQuery,
  setSearchQuery,
  translations,
}: ActiveFiltersProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-4 hidden flex-wrap items-center gap-2 rounded-md bg-gray-50 p-2 sm:mb-6 sm:flex">
      <SlidersHorizontal className="h-4 w-4 text-gray-500" />
      <span className="text-xs font-medium text-gray-700 sm:text-sm">
        {translations.filters}:
      </span>

      {selectedCategory !== "All" && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1 rounded-full px-2 py-0 text-xs"
          onClick={() => setSelectedCategory("All")}
        >
          {
            categories?.find((category) => category.slug === selectedCategory)
              ?.name
          }
          <X className="h-3 w-3" />
        </Button>
      )}

      {selectedBrand && selectedBrand.length > 0 && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1 rounded-full px-2 py-0 text-xs"
          onClick={() => setSelectedBrand([])}
        >
          {selectedBrand
            .map(
              (slug) =>
                brands?.find((brand) => brand.slug === slug)?.name ?? slug,
            )
            .join(", ")}
          <X className="h-3 w-3" />
        </Button>
      )}

      {selectedPriceRange !== defaultPriceRange && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1 rounded-full px-2 py-0 text-xs"
          onClick={() => setSelectedPriceRange(defaultPriceRange)}
        >
          {selectedPriceRange.label}
          <X className="h-3 w-3" />
        </Button>
      )}

      {searchQuery && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1 rounded-full px-2 py-0 text-xs"
          onClick={() => setSearchQuery("")}
        >
          &quot;{searchQuery}&quot;
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
