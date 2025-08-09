import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PRICE_RANGES, type PriceRange } from "@/lib/data";
import { useCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";

interface FilterDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  selectedPriceRange: PriceRange;
  setSelectedPriceRange: (range: PriceRange) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  translations: {
    filters: string;
    adjustFilters: string;
    activeFilters: string;
    clearAll: string;
    categories: string;
    brands: string;
    priceRange: string;
    applyFilters: string;
    clearFilters: string;
    close: string;
  };
}

export function FilterDrawer({
  isOpen,
  onOpenChange,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedPriceRange,
  setSelectedPriceRange,
  searchQuery,
  setSearchQuery,
  clearFilters,
  activeFiltersCount,
  hasActiveFilters,
  translations,
}: FilterDrawerProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-10 flex-1 items-center justify-center gap-1.5"
          aria-label={`${translations.filters}${hasActiveFilters ? ` (${activeFiltersCount} ${translations.activeFilters})` : ""}`}
        >
          <Filter className="h-4 w-4" />
          {translations.filters}
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground ml-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] overflow-hidden">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-xl font-bold text-gray-900">
            {translations.filters}
          </DrawerTitle>
          <DrawerDescription className="text-sm text-gray-600">
            {translations.adjustFilters}
          </DrawerDescription>
        </DrawerHeader>
        <div
          className="overflow-y-auto px-4"
          style={{ maxHeight: "calc(85vh - 180px)" }}
        >
          {/* Active Filters Summary in Drawer */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md bg-gray-50 p-3 shadow-sm">
              <div className="mb-1 flex w-full items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {translations.activeFilters}:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/10 h-7 px-2 py-0 text-xs font-medium"
                  onClick={clearFilters}
                >
                  {translations.clearAll}
                </Button>
              </div>

              {selectedCategory !== "All" && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium"
                  onClick={() => setSelectedCategory("All")}
                >
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </Button>
              )}

              {selectedBrand !== "All" && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium"
                  onClick={() => setSelectedBrand("All")}
                >
                  {selectedBrand}
                  <X className="h-3 w-3" />
                </Button>
              )}

              {selectedPriceRange !== PRICE_RANGES[0] && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium"
                  onClick={() => setSelectedPriceRange(PRICE_RANGES[0])}
                >
                  {selectedPriceRange.label}
                  <X className="h-3 w-3" />
                </Button>
              )}

              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium text-gray-800"
                  onClick={() => setSearchQuery("")}
                >
                  &quot;{searchQuery}&quot;
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}

          <div className="grid gap-5 pb-4">
            {/* Categories */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                {translations.categories}
              </h4>
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-gray-100 p-2 shadow-sm sm:max-h-40 sm:gap-2">
                {categories?.map((category) => (
                  <Button
                    key={category.name}
                    variant={
                      selectedCategory === category.slug ? "default" : "outline"
                    }
                    size="sm"
                    className={`text-xs font-medium sm:text-sm ${
                      selectedCategory === category.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.slug);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                {translations.brands}
              </h4>
              <div className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto rounded-md border border-gray-100 p-2 shadow-sm sm:max-h-40 sm:gap-2">
                {brands?.map((brand) => (
                  <Button
                    key={brand.slug}
                    variant={
                      selectedBrand === brand.slug ? "default" : "outline"
                    }
                    size="sm"
                    className={`text-xs font-medium sm:text-sm ${
                      selectedBrand === brand.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedBrand(brand.slug);
                    }}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            {/* <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-800">
                {translations.priceRange}
              </h4>
              <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-100 p-2 shadow-sm sm:gap-2">
                {PRICE_RANGES.map((range) => (
                  <Button
                    key={range.label}
                    variant={
                      selectedPriceRange === range ? "default" : "outline"
                    }
                    size="sm"
                    className={`text-xs font-medium sm:text-sm ${
                      selectedPriceRange === range
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedPriceRange(range);
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
        <DrawerFooter className="border-t bg-gray-50 pt-4">
          <Button
            variant="default"
            className="font-medium"
            onClick={() => onOpenChange(false)}
          >
            {translations.applyFilters}
          </Button>
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={clearFilters}
            >
              {translations.clearFilters}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
