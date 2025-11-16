import {
  FilterDrawer,
  ViewOptionsDrawer,
  SortDrawer,
} from "@/components/filters";
import { Dispatch, SetStateAction } from "react";

// Define interfaces for the translation objects
interface FilterTranslations {
  filters: string;
  adjustFilters: string;
  activeFilters: string;
  clearAll: string;
  categories: string;
  brands: string;
  priceRange: string;
  size?: string;
  price?: string;
  applyFilters: string;
  clearFilters: string;
  close: string;
}

interface ViewOptionsTranslations {
  viewOptions: string;
  selectViewMode: string;
  grid: string;
  list: string;
  close: string;
}

interface SortTranslations {
  sortBy: string;
  selectSortOrder: string;
  close: string;
}

interface SortOptionTranslations {
  featured: string;
  priceLow: string;
  priceHigh: string;
  nameAsc: string;
  nameDesc: string;
}

interface MobileControlsBarProps {
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (open: boolean) => void;
  isSortDrawerOpen: boolean;
  setIsSortDrawerOpen: (open: boolean) => void;
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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  filterTranslations: FilterTranslations;
  viewOptionsTranslations: ViewOptionsTranslations;
  sortTranslations: SortTranslations;
  sortOptionTranslations: SortOptionTranslations;
}

export function MobileControlsBar({
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
  isViewDrawerOpen,
  setIsViewDrawerOpen,
  isSortDrawerOpen,
  setIsSortDrawerOpen,
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
  activeTab,
  setActiveTab,
  sortOption,
  setSortOption,
  filterTranslations,
  viewOptionsTranslations,
  sortTranslations,
  sortOptionTranslations,
}: MobileControlsBarProps) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2 sm:hidden">
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        translations={filterTranslations}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
      />

      {/* Mobile View Drawer */}
      <ViewOptionsDrawer
        isOpen={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        translations={viewOptionsTranslations}
      />

      {/* Mobile Sort Drawer */}
      <SortDrawer
        isOpen={isSortDrawerOpen}
        onOpenChange={setIsSortDrawerOpen}
        sortOption={sortOption}
        setSortOption={setSortOption}
        translations={sortTranslations}
        sortTranslations={sortOptionTranslations}
      />
    </div>
  );
}
