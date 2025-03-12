import {
  FilterDrawer,
  ViewOptionsDrawer,
  SortDrawer,
} from "@/components/filters";
import { PriceRange } from "@/lib/data";

interface MobileControlsBarProps {
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isViewDrawerOpen: boolean;
  setIsViewDrawerOpen: (open: boolean) => void;
  isSortDrawerOpen: boolean;
  setIsSortDrawerOpen: (open: boolean) => void;
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
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  filterTranslations: any;
  viewOptionsTranslations: any;
  sortTranslations: any;
  sortOptionTranslations: any;
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
    <div className="mb-5 flex items-center justify-between gap-2 sm:hidden">
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        clearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        translations={filterTranslations}
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
