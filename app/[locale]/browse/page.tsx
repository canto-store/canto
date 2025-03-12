"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ProductGrid, ProductList } from "@/components/products";
import { Button } from "@/components/ui/button";
import { Filter, X, LayoutGrid, List } from "lucide-react";
import { CATEGORIES, BRANDS, PRICE_RANGES, Product } from "@/lib/data";
import { filterProducts } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortMenu, type SortOption } from "@/components/common/SortMenu";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { ItemsPerPage } from "@/components/ui/items-per-page";
import { useTranslations } from "next-intl";
import {
  FilterDrawer,
  FilterPanel,
  ActiveFilters,
  ViewOptionsDrawer,
  SortDrawer,
} from "@/components/filters";

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const isRTL = params.locale === "ar";
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialTab = searchParams.get("tab") || "grid";
  const initialBrand = searchParams.get("brand") || "All";
  const initialPage = Number(searchParams.get("page") || "1");
  const initialItemsPerPage = Number(searchParams.get("perPage") || "10");
  const initialSort = searchParams.get("sort") || "featured";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState(initialSort);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Mobile drawer states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

  // Get translations
  const t = useTranslations();
  const productsT = useTranslations("products");
  const sortT = useTranslations("sort");

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedBrand !== "All") count++;
    if (selectedPriceRange !== PRICE_RANGES[0]) count++;
    if (searchQuery) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const hasActiveFilters = activeFiltersCount > 0;

  // Update URL when filters or pagination change
  useEffect(() => {
    const urlParams = new URLSearchParams();

    if (searchQuery) urlParams.set("q", searchQuery);
    if (selectedCategory !== "All") urlParams.set("category", selectedCategory);
    if (selectedBrand !== "All") urlParams.set("brand", selectedBrand);
    if (sortOption !== "featured") urlParams.set("sort", sortOption);
    if (activeTab !== "grid") urlParams.set("tab", activeTab);
    if (currentPage !== 1) urlParams.set("page", currentPage.toString());
    if (itemsPerPage !== 10) urlParams.set("perPage", itemsPerPage.toString());

    const locale = typeof params.locale === "string" ? params.locale : "en";
    const newUrl = `/${locale}/browse${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    sortOption,
    activeTab,
    currentPage,
    itemsPerPage,
    router,
    params.locale,
  ]);

  // Filter and sort products
  useEffect(() => {
    let products = filterProducts(
      searchQuery,
      selectedCategory,
      selectedPriceRange,
      selectedBrand,
    );

    // Sort products based on selected option
    switch (sortOption) {
      case "price-low":
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products = [...products].sort((a, b) => b.name.localeCompare(a.name));
        break;
      // featured is default, no sorting needed
    }

    setFilteredProducts(products);

    // Don't reset page when coming from a URL with a page parameter
    if (!searchParams.has("page")) {
      setCurrentPage(1);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedPriceRange,
    sortOption,
    searchParams,
  ]);

  // Calculate paginated products and total pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    setTotalPages(totalPages || 1);

    // Ensure current page is valid
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      return;
    }

    // Calculate paginated products
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSortOption("featured");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("products-section")?.offsetTop || 0,
      behavior: "smooth",
    });
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

  // Filter translations
  const filterTranslations = {
    filters: productsT("filters"),
    adjustFilters: productsT("adjustFilters"),
    activeFilters: productsT("activeFilters"),
    clearAll: productsT("clearAll"),
    categories: productsT("categories"),
    brands: productsT("brands"),
    priceRange: productsT("priceRange"),
    applyFilters: productsT("applyFilters"),
    clearFilters: productsT("clearFilters"),
    close: productsT("close"),
  };

  // View options translations
  const viewOptionsTranslations = {
    viewOptions: productsT("viewOptions"),
    selectViewMode: productsT("selectViewMode"),
    grid: productsT("grid"),
    list: productsT("list"),
    close: productsT("close"),
  };

  // Sort translations
  const sortTranslations = {
    sortBy: productsT("sortBy"),
    selectSortOrder: productsT("selectSortOrder"),
    close: productsT("close"),
  };

  // Sort option translations
  const sortOptionTranslations = {
    featured: sortT("featured"),
    priceLow: sortT("priceLow"),
    priceHigh: sortT("priceHigh"),
    nameAsc: sortT("nameAsc"),
    nameDesc: sortT("nameDesc"),
  };

  return (
    <PageShell>
      <div className="w-full">
        {/* Header section with title */}
        <div className="mb-5 flex flex-col gap-2 sm:mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            {productsT("browseTitle")}
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            {productsT("productsCount", { count: filteredProducts.length })}
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder={t("header.placeholder")}
              value={searchQuery}
              onSubmit={handleSearch}
              className="border-light-gray w-full border-2"
              buttonText={t("header.search")}
            />
          </div>

          <div className="flex items-center gap-2 self-start">
            {/* Desktop Filter Button */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="hidden h-10 items-center gap-1.5 sm:flex"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <X className="h-4 w-4" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              {showFilters ? productsT("clearFilters") : productsT("filters")}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-10 text-xs sm:flex sm:text-sm"
                onClick={clearFilters}
              >
                {productsT("clearFilters")}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Controls Bar */}
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
          translations={{ filters: productsT("filters") }}
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
              categories: productsT("categories"),
              brands: productsT("brands"),
              priceRange: productsT("priceRange"),
            }}
          />
        )}

        {/* Results Controls */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Results Count */}
          <p
            className="text-sm text-gray-600 sm:text-base"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {productsT("productsCount", { count: filteredProducts.length })}
            {filteredProducts.length > 0 && (
              <span
                className={`${isRTL ? "mr-1" : "ml-1"} text-xs text-gray-500 sm:text-sm`}
              >
                (
                {formatNumber(
                  Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredProducts.length,
                  ),
                )}{" "}
                -{" "}
                {formatNumber(
                  Math.min(currentPage * itemsPerPage, filteredProducts.length),
                )}{" "}
                / {formatNumber(filteredProducts.length)})
              </span>
            )}
          </p>

          {/* Desktop View Controls */}
          <div className="hidden items-center justify-end gap-3 sm:flex">
            <div className="flex items-center gap-3">
              {/* Desktop View mode buttons */}
              <div className="h-9 w-[160px] overflow-hidden rounded-md border">
                <Button
                  variant={activeTab === "grid" ? "default" : "ghost"}
                  className="flex-1 rounded-none"
                  onClick={() => setActiveTab("grid")}
                >
                  <LayoutGrid className="mr-1 h-4 w-4" />
                  {productsT("grid")}
                </Button>
                <Button
                  variant={activeTab === "list" ? "default" : "ghost"}
                  className="flex-1 rounded-none"
                  onClick={() => setActiveTab("list")}
                >
                  <List className="mr-1 h-4 w-4" />
                  {productsT("list")}
                </Button>
              </div>

              <SortMenu
                value={sortOption as SortOption}
                onValueChange={setSortOption}
                label={productsT("sortBy")}
                width="w-[180px]"
              />
            </div>

            <ItemsPerPage
              defaultValue={itemsPerPage}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[5, 10, 15, 20]}
            />
          </div>

          {/* Mobile Items Per Page */}
          <div className="flex justify-end sm:hidden">
            <ItemsPerPage
              defaultValue={itemsPerPage}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[5, 10, 15, 20]}
            />
          </div>
        </div>

        {/* Products Display */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
          id="products-section"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {filteredProducts.length > 0 ? (
            <>
              <TabsContent value="grid" className="mt-4 sm:mt-6">
                <ProductGrid
                  products={paginatedProducts}
                  className={`xs:grid-cols-2 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isRTL ? "rtl" : ""}`}
                />
              </TabsContent>

              <TabsContent value="list" className="mt-4 sm:mt-6">
                <ProductList products={paginatedProducts} />
              </TabsContent>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-6 sm:mt-8"
              />
            </>
          ) : (
            <div
              className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center sm:h-64 sm:p-8"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="mb-2 text-lg font-medium text-black sm:text-xl">
                {productsT("noProductsFound")}
              </p>
              <p className="text-sm text-gray-500 sm:text-base">
                {productsT("tryAdjusting")}
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                {productsT("clearFilters")}
              </Button>
            </div>
          )}
        </Tabs>
      </div>
    </PageShell>
  );
}
