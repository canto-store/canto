"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from "@heroui/react";
import { Slider } from "@heroui/react";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";
import { formatPrice } from "@/lib/utils";
import { usePriceRange, useSizes } from "@/lib/filters";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string[] | undefined;
  setSelectedBrand: (brand: string[] | undefined) => void;
  selectedSize: string | undefined;
  setSelectedSize: (size: string) => void;
  selectedPriceRange: [number, number];
  setSelectedPriceRange: Dispatch<SetStateAction<[number, number]>>;
  translations: {
    categories: string;
    brands: string;
    size?: string;
    price?: string;
  };
}

export function FilterPanel({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedSize,
  setSelectedSize,
  selectedPriceRange,
  setSelectedPriceRange,
  translations,
}: FilterPanelProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const isBrandsEnabled = selectedCategory !== "All";
  const { data: brands, isLoading: brandsLoading } = useBrands(
    isBrandsEnabled ? selectedCategory : undefined,
    isBrandsEnabled,
  );
  const { data: sizes, isSuccess } = useSizes();

  const { data: priceRange } = usePriceRange();

  // Local state for immediate UI feedback
  const [localPriceRange, setLocalPriceRange] =
    useState<[number, number]>(selectedPriceRange);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update local state when selectedPriceRange changes from parent (e.g., on initial load or reset)
  useEffect(() => {
    setLocalPriceRange(selectedPriceRange);
  }, [selectedPriceRange]);

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

  useEffect(() => {
    if (priceRange) {
      setSelectedPriceRange(priceRange);
    }
  }, [priceRange, setSelectedPriceRange]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm sm:my-2">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Categories */}
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">
            {translations.categories}
          </h4>
          {categoriesLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-20 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {categories
                ?.filter((category) => category.name && category.slug)
                .map((category) => (
                  <Button
                    key={category.slug}
                    variant={
                      selectedCategory === category.slug ? "default" : "outline"
                    }
                    size="sm"
                    className="text-sm"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.slug
                          ? "All"
                          : category.slug,
                      )
                    }
                  >
                    {category.name}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">
            {translations.brands}
          </h4>
          {brandsLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
              {brands
                ?.filter((brand) => brand.name && brand.slug)
                .map((brand) => (
                  <Button
                    key={brand.slug}
                    variant={
                      selectedBrand?.includes(brand.slug)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="text-sm"
                    onClick={() => {
                      if (selectedBrand?.includes(brand.slug)) {
                        setSelectedBrand(
                          selectedBrand.filter((b) => b !== brand.slug),
                        );
                      } else {
                        setSelectedBrand([
                          ...(selectedBrand ?? []),
                          brand.slug,
                        ]);
                      }
                    }}
                  >
                    {brand.name}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* Size Dropdown */}

        {isSuccess ? (
          <div>
            <h4 className="mb-1 text-sm font-medium text-gray-700">
              {translations.size || "Size"}
            </h4>
            <Dropdown placement="bottom-start">
              <DropdownTrigger className="hover:bg-primary-50">
                <Button className="w-full justify-between border border-gray-300 bg-white text-gray-700">
                  {selectedSize || "Select Size"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select size"
                onAction={(key) => setSelectedSize(String(key))}
              >
                {sizes.map((size) => (
                  <DropdownItem key={size.value}>{size.value}</DropdownItem>
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
  );
}
