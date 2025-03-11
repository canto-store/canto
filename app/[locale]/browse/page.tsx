"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ProductGrid, ProductList } from "@/components/products";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Filter } from "lucide-react";
import { CATEGORIES, BRANDS, PRICE_RANGES, Product } from "@/lib/data";
import { filterProducts } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortMenu, type SortOption } from "@/components/common/SortMenu";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { ItemsPerPage } from "@/components/ui/items-per-page";
import { useTranslations } from "next-intl";

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

  // Get translations
  const t = useTranslations();
  const productsT = useTranslations("products");

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

  const handleQuickAdd = (productName: string) => {
    toast(productsT("addedToCart", { productName }), {
      description: t("cart.viewCart"),
    });
  };

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

  return (
    <PageShell>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold">{productsT("browseTitle")}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {productsT("filters")}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        {showFilters && (
          <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-medium text-black">
              {productsT("filters")}:
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Categories */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  {productsT("categories")}
                </h4>
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.name}
                      variant={
                        selectedCategory === category.name
                          ? "default"
                          : "outline"
                      }
                      size="sm"
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
                  {productsT("brands")}
                </h4>
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
                  {BRANDS.map((brand) => (
                    <Button
                      key={brand}
                      variant={selectedBrand === brand ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  {productsT("priceRange")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range) => (
                    <Button
                      key={range.label}
                      variant={
                        selectedPriceRange === range ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedPriceRange(range)}
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            placeholder={t("header.placeholder")}
            value={searchQuery}
            onSubmit={handleSearch}
            className="border-light-gray border-2"
            buttonText={t("header.search")}
          />
        </div>

        {/* Results Count and Items Per Page */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-gray-600" dir={isRTL ? "rtl" : "ltr"}>
            {productsT("productsCount", { count: filteredProducts.length })}
            {filteredProducts.length > 0 && (
              <span
                className={`${isRTL ? "mr-1" : "ml-1"} text-sm text-gray-500`}
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

          <ItemsPerPage
            defaultValue={itemsPerPage}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            options={[5, 10, 15, 20]}
          />

          <Separator className="mt-2 sm:hidden" />
        </div>

        {/* View Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
          id="products-section"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div
            className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="grid">{productsT("grid")}</TabsTrigger>
              <TabsTrigger value="list">{productsT("list")}</TabsTrigger>
            </TabsList>
            <SortMenu
              value={sortOption as SortOption}
              onValueChange={setSortOption}
              label={productsT("sortBy")}
            />
          </div>

          {/* Products Display */}
          {filteredProducts.length > 0 ? (
            <>
              <TabsContent value="grid" className="mt-0">
                <ProductGrid
                  products={paginatedProducts}
                  className={`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isRTL ? "rtl" : ""}`}
                />
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-0">
                <ProductList
                  products={paginatedProducts}
                  onAddToCart={handleQuickAdd}
                />
              </TabsContent>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            </>
          ) : (
            <div
              className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="mb-2 text-xl font-medium text-black">
                {productsT("noProductsFound")}
              </p>
              <p className="text-gray-500">{productsT("tryAdjusting")}</p>
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
