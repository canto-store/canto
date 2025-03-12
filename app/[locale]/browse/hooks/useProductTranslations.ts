import { useTranslations } from "next-intl";

export function useProductTranslations() {
  const t = useTranslations();
  const productsT = useTranslations("products");
  const sortT = useTranslations("sort");

  // Helper function to safely get translations with fallbacks
  const safeTranslation = (key: string, fallback: string): string => {
    try {
      return productsT(key);
    } catch (error) {
      return fallback;
    }
  };

  // Filter translations
  const filterTranslations = {
    filters: safeTranslation("filters", "Filters"),
    adjustFilters: safeTranslation("adjustFilters", "Adjust filters"),
    activeFilters: safeTranslation("activeFilters", "Active filters"),
    clearAll: safeTranslation("clearAll", "Clear all"),
    categories: safeTranslation("categories", "Categories"),
    brands: safeTranslation("brands", "Brands"),
    priceRange: safeTranslation("priceRange", "Price range"),
    applyFilters: safeTranslation("applyFilters", "Apply filters"),
    clearFilters: safeTranslation("clearFilters", "Clear filters"),
    close: safeTranslation("close", "Close"),
  };

  // View options translations
  const viewOptionsTranslations = {
    viewOptions: safeTranslation("viewOptions", "View options"),
    selectViewMode: safeTranslation("selectViewMode", "Select view mode"),
    grid: safeTranslation("grid", "Grid"),
    list: safeTranslation("list", "List"),
    close: safeTranslation("close", "Close"),
  };

  // Sort translations
  const sortTranslations = {
    sortBy: safeTranslation("sortBy", "Sort by"),
    selectSortOrder: safeTranslation("selectSortOrder", "Select sort order"),
    close: safeTranslation("close", "Close"),
  };

  // Sort option translations with fallbacks
  const getSortTranslation = (key: string, fallback: string): string => {
    try {
      return sortT(key);
    } catch (error) {
      return fallback;
    }
  };

  // Sort option translations
  const sortOptionTranslations = {
    featured: getSortTranslation("featured", "Featured"),
    priceLow: getSortTranslation("priceLow", "Price: Low to high"),
    priceHigh: getSortTranslation("priceHigh", "Price: High to low"),
    nameAsc: getSortTranslation("nameAsc", "Name: A to Z"),
    nameDesc: getSortTranslation("nameDesc", "Name: Z to A"),
  };

  return {
    t,
    productsT,
    sortT,
    filterTranslations,
    viewOptionsTranslations,
    sortTranslations,
    sortOptionTranslations,
  };
}
