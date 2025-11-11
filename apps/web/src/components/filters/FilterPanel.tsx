"use client";

import { Button } from "@/components/ui/button";
import { useAllCategories, useCategories } from "@/lib/categories";
import { useBrands } from "@/lib/brand";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Slider } from "@heroui/react";
import { useState } from "react";

interface FilterPanelProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string[] | undefined;
  setSelectedBrand: (brand: string[] | undefined) => void;
  selectedSize?: string;
  setSelectedSize?: (size: string) => void;
  selectedPriceRange?: [number, number];
  setSelectedPriceRange?: (range: [number, number]) => void;
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

  // Default sizes
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Default price range (0 to 1000)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    selectedPriceRange || [0, 1000],
  );

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalPriceRange([value[0], value[1]]);
      setSelectedPriceRange?.([value[0], value[1]]);
    }
  };

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
              onAction={(key) => setSelectedSize?.(String(key))}
            >
              {sizes.map((size) => (
                <DropdownItem key={size}>{size}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Price Range Slider */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            {translations.price || "Price Range"}
          </h4>
          <div className="px-2">
            <Slider
              aria-label="Price range"
              minValue={0}
              maxValue={1000}
              step={10}
              value={localPriceRange}
              onChange={handlePriceChange}
              formatOptions={{ style: "currency", currency: "USD" }}
              showTooltip
            />
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>EGP {localPriceRange[0]}</span>
              <span>EGP {localPriceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
