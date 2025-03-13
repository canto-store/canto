import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Product } from "@/types";
import { PRICE_RANGES } from "@/lib/data";
import { filterProducts } from "@/lib/utils";
export function useProductFilters() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const isRTL = params.locale === "ar";

  // Initialize state from URL params
  const initialCategory = searchParams.get("category") || "All";
  const initialQuery = searchParams.get("q") || "";
  const initialTab = searchParams.get("tab") || "grid";
  const initialBrand = searchParams.get("brand") || "All";
  const initialPage = Number(searchParams.get("page") || "1");
  const initialItemsPerPage = Number(searchParams.get("perPage") || "10");
  const initialSort = searchParams.get("sort") || "featured";

  // State
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

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (selectedBrand !== "All") count++;
    if (selectedPriceRange !== PRICE_RANGES[0]) count++;
    if (searchQuery) count++;
    return count;
  }, [selectedCategory, selectedBrand, selectedPriceRange, searchQuery]);

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

  return {
    // State
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
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginatedProducts,
    totalPages,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    isViewDrawerOpen,
    setIsViewDrawerOpen,
    isSortDrawerOpen,
    setIsSortDrawerOpen,

    // Computed values
    activeFiltersCount,
    hasActiveFilters,
    isRTL,

    // Methods
    handleSearch,
    clearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    formatNumber,
  };
}
