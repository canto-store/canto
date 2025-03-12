"use client";

import { AppLayout } from "@/components/layout";
import { PRICE_RANGES } from "@/lib/data";
import { useProductFilters, useProductTranslations } from "./hooks";
import {
  SearchFilterBar,
  MobileControlsBar,
  ResultsControls,
  ProductsDisplay,
} from "./components";
import { ActiveFilters, FilterPanel } from "@/components/filters";

export default function BrowsePage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedPriceRange,
    setSelectedPriceRange,
    filteredProducts,
    showFilters,
    setShowFilters,
    sortOption,
    setSortOption,
    activeTab,
    setActiveTab,
    currentPage,
    itemsPerPage,
    paginatedProducts,
    totalPages,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    isSortDrawerOpen,
    setIsSortDrawerOpen,
    activeFiltersCount,
    hasActiveFilters,
    isRTL,
    handleSearch,
    clearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    formatNumber,
  } = useProductFilters();

  const {
    filterTranslations,
    viewOptionsTranslations,
    sortTranslations,
    sortOptionTranslations,
  } = useProductTranslations();

  return (
    <AppLayout>
      <div className="mt-3 w-full">
        {/* Search and Filter Controls */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />

        {/* Mobile Controls Bar */}
        <MobileControlsBar
          isFilterDrawerOpen={isFilterDrawerOpen}
          setIsFilterDrawerOpen={setIsFilterDrawerOpen}
          isViewDrawerOpen={isViewDrawerOpen}
          setIsViewDrawerOpen={setIsViewDrawerOpen}
          isSortDrawerOpen={isSortDrawerOpen}
          setIsSortDrawerOpen={setIsSortDrawerOpen}
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterTranslations={filterTranslations}
          viewOptionsTranslations={viewOptionsTranslations}
          sortTranslations={sortTranslations}
          sortOptionTranslations={sortOptionTranslations}
        />

        {/* Active Filters Summary */}
        <ActiveFilters
          hasActiveFilters={hasActiveFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedPriceRange={selectedPriceRange}
          defaultPriceRange={PRICE_RANGES[0]}
          setSelectedPriceRange={setSelectedPriceRange}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          translations={{ filters: filterTranslations.filters }}
        />

        {/* Desktop Filters Panel */}
        {showFilters && (
          <FilterPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            translations={{
              categories: filterTranslations.categories,
              brands: filterTranslations.brands,
              priceRange: filterTranslations.priceRange,
            }}
          />
        )}

        {/* Results Controls */}
        <ResultsControls
          filteredProductsCount={filteredProducts.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isRTL={isRTL}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onItemsPerPageChange={handleItemsPerPageChange}
          formatNumber={formatNumber}
        />

        {/* Products Display */}
        <ProductsDisplay
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredProducts={filteredProducts}
          paginatedProducts={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          clearFilters={clearFilters}
          isRTL={isRTL}
        />
      </div>
    </AppLayout>
  );
}
