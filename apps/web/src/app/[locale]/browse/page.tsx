"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useProductSearch, ProductSearchParams } from "@/lib/product";
import { PRICE_RANGES } from "@/lib/data";
import { useProductTranslations } from "./hooks";
import {
  SearchFilterBar,
  MobileControlsBar,
  ResultsControls,
  ProductsDisplay,
} from "./components";
import { ActiveFilters, FilterPanel } from "@/components/filters";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const isRTL = params.locale === "ar";

  // Initialize state from URL params
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialTab = searchParams.get("tab") || "grid";
  const initialBrand = searchParams.get("brand")
    ? searchParams.get("brand")?.split("+")
    : [];
  const initialPage = Number(searchParams.get("page") || "1");
  const initialItemsPerPage = Number(searchParams.get("perPage") || "10");
  const initialSort = searchParams.get("sort") || "featured";

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState(initialSort);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Mobile drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

  // Prepare search parameters for API
  const searchApiParams: ProductSearchParams = useMemo(() => {
    const params: ProductSearchParams = {
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
    };

    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (selectedBrand) params.brand = selectedBrand?.join("+");
    if (selectedPriceRange.min > 0)
      params.minPrice = selectedPriceRange.min.toString();
    if (selectedPriceRange.max < Infinity)
      params.maxPrice = selectedPriceRange.max.toString();

    // Map sort options to API format
    switch (sortOption) {
      case "price-low":
        params.sortBy = "price";
        params.sortOrder = "asc";
        break;
      case "price-high":
        params.sortBy = "price";
        params.sortOrder = "desc";
        break;
      case "name-asc":
        params.sortBy = "name";
        params.sortOrder = "asc";
        break;
      case "name-desc":
        params.sortBy = "name";
        params.sortOrder = "desc";
        break;
    }

    return params;
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    sortOption,
    currentPage,
    itemsPerPage,
  ]);

  // Fetch products using the API
  const {
    data: searchResult,
    isLoading,
    error,
  } = useProductSearch(searchApiParams);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedBrand && selectedBrand.length > 0)
      count += selectedBrand.length;
    if (selectedPriceRange !== PRICE_RANGES[0]) count++;
    if (searchQuery) count++;
    return count;
  }, [selectedCategory, selectedBrand, selectedPriceRange, searchQuery]);

  const hasActiveFilters = activeFiltersCount > 0;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Update URL when filters or pagination change
  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (searchQuery) urlParams.set("q", searchQuery);
    if (selectedCategory !== "All") urlParams.set("category", selectedCategory);
    if (selectedBrand && selectedBrand?.length > 0)
      urlParams.set("brand", selectedBrand?.join("+"));
    if (sortOption !== "featured") urlParams.set("sort", sortOption);
    if (activeTab !== "grid") urlParams.set("tab", activeTab);
    if (currentPage !== 1) urlParams.set("page", currentPage.toString());
    if (itemsPerPage !== 10) urlParams.set("perPage", itemsPerPage.toString());

    const locale = typeof params.locale === "string" ? params.locale : "en";
    const newUrl = `/${locale}/browse${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;

    // Use replace instead of push to avoid adding to history stack
    // and prevent navigation during render
    router.replace(newUrl, { scroll: false });
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    sortOption,
    activeTab,
    currentPage,
    itemsPerPage,
    params.locale,
    router,
  ]);

  const {
    filterTranslations,
    viewOptionsTranslations,
    sortTranslations,
    sortOptionTranslations,
  } = useProductTranslations();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand([]);
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSortOption("featured");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Convert to Arabic numerals if needed
  const formatNumber = (num: number): string => {
    if (!isRTL) return num.toString();

    // Convert to Arabic numerals
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
  };

  // Show loading or error states
  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Fixed Controls */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
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
            translations={{
              categories: filterTranslations.categories,
              brands: filterTranslations.brands,
            }}
          />
        )}

        {/* Results Controls */}
        <ResultsControls
          filteredProductsCount={searchResult?.total || 0}
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
      </div>

      {/* Scrollable Products Section */}
      <div className="flex-1 overflow-y-auto px-2 pb-8">
        <ProductsDisplay
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredProducts={searchResult?.products || []}
          paginatedProducts={searchResult?.products || []}
          currentPage={currentPage}
          totalPages={searchResult?.totalPages || 1}
          onPageChange={handlePageChange}
          clearFilters={clearFilters}
          isRTL={isRTL}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
