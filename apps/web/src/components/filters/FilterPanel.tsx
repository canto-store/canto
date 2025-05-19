import { Button } from "@/components/ui/button";
import { CATEGORIES, PRICE_RANGES, type PriceRange } from "@/lib/data";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedPriceRange: PriceRange;
  setSelectedPriceRange: (range: PriceRange) => void;
  translations: {
    categories: string;
    brands: string;
    priceRange: string;
  };
}

export function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  // selectedBrand,
  // setSelectedBrand,
  selectedPriceRange,
  setSelectedPriceRange,
  translations,
}: FilterPanelProps) {
  return (
    <div className="mb-6 hidden rounded-lg border p-3 shadow-sm sm:block sm:p-4">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {/* Categories */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            {translations.categories}
          </h4>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto sm:max-h-40 sm:gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            {translations.brands}
          </h4>
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto sm:max-h-40 sm:gap-2">
            {/* {BRANDS.map((brand) => (
              <Button
                key={brand.slug}
                variant={selectedBrand === brand.name ? "default" : "outline"}
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setSelectedBrand(brand.slug)}
              >
                {brand.name}
              </Button>
            ))} */}
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            {translations.priceRange}
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {PRICE_RANGES.map((range) => (
              <Button
                key={range.label}
                variant={selectedPriceRange === range ? "default" : "outline"}
                size="sm"
                className="text-xs sm:text-sm"
                onClick={() => setSelectedPriceRange(range)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
