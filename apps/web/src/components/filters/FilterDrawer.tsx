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
import { useCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";
import { usePriceRange, useSizes } from "@/lib/filters";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Slider,
} from "@heroui/react";
import { formatPrice } from "@/lib/utils";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

interface FilterDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string[] | undefined;
  setSelectedBrand: (brand: string[]) => void;
  selectedSize: string | undefined;
  setSelectedSize: (size: string) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: Dispatch<SetStateAction<[number, number]>>;
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
    size?: string;
    price?: string;
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
  selectedSize,
  setSelectedSize,
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

  const { data: sizes, isSuccess } = useSizes();
  const { data: priceRange } = usePriceRange();

  // Local state for immediate UI feedback
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(selectedPriceRange);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePriceChange = useCallback(
    (value: number | number[]) => {
      if (Array.isArray(value)) {
        const newRange: [number, number] = [value[0], value[1]];

        // Update local state immediately for instant visual feedback
        setLocalPriceRange(newRange);

        // Clear existing timer
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        // Debounce only the parent state update (which triggers API calls)
        debounceTimer.current = setTimeout(() => {
          setSelectedPriceRange?.(newRange);
        }, 300); // Reduced to 300ms for better UX
      }
    },
    [setSelectedPriceRange],
  );

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
                  {categories?.find((c) => c.slug === selectedCategory)?.name ||
                    selectedCategory}
                  <X className="h-3 w-3" />
                </Button>
              )}

              {selectedBrand &&
                selectedBrand.length > 0 &&
                selectedBrand.map((brand) => (
                  <Button
                    key={brand}
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium"
                    onClick={() =>
                      setSelectedBrand(selectedBrand.filter((b) => b !== brand))
                    }
                  >
                    {brands?.find((b) => b.slug === brand)?.name || brand}
                    <X className="h-3 w-3" />
                  </Button>
                ))}

              {searchQuery && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 gap-1 rounded-full px-2 py-0 text-xs font-medium"
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
                      selectedBrand?.includes(brand.slug)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className={`text-xs font-medium sm:text-sm ${
                      selectedBrand?.includes(brand.slug)
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedBrand(
                        selectedBrand?.includes(brand.slug)
                          ? selectedBrand.filter((b) => b !== brand.slug)
                          : [...(selectedBrand ?? []), brand.slug],
                      );
                    }}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size Dropdown */}

            {isSuccess ? (
              <div>
                <h4 className="mb-1 text-sm font-medium text-gray-700">
                  {translations.size || "Size"}
                </h4>
                <Dropdown placement="bottom-start">
                  <DropdownTrigger>
                    <Button className="w-full justify-between border border-gray-300 bg-white text-gray-700">
                      {selectedSize || "Select Size"}
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="Select size"
                    closeOnSelect
                    onAction={(key) => {
                      console.log("Selected:", key);
                      setSelectedSize(String(key));
                    }}
                  >
                    {sizes.map((size) => (
                      <DropdownItem
                        key={size.value}
                        onPress={() => {
                          console.log("onPress:", size.value);
                          setSelectedSize(size.value);
                        }}
                      >
                        {size.value}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            ) : (
              <Skeleton className="h-10 w-full" />
            )}

            {/* Price Range Slider */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                {translations.price || "Price Range"}
              </h4>
              <div className="px-2">
                <Slider
                  aria-label="Price range"
                  minValue={priceRange?.[0] ?? 1000}
                  maxValue={priceRange?.[1] ?? 1000}
                  step={10}
                  value={localPriceRange}
                  onChange={handlePriceChange}
                  formatOptions={{ style: "currency", currency: "EGP" }}
                  showTooltip
                />
                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>{formatPrice(localPriceRange[0])}</span>
                  <span>{formatPrice(localPriceRange[1])}</span>
                </div>
              </div>
            </div>
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
