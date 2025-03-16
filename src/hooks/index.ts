// Export hooks that don't have conflicts
export * from "./use-protected-route";
export * from "./use-sign-up";

// Re-export hooks from the conflicting modules
export { useCategories } from "./use-categories";
export { useHomeProducts } from "./use-home-products";

// Re-export types with proper syntax
export type {
  Category,
  Subcategory,
  SubcategoryTitle,
  CategoriesData,
} from "./use-categories";

export type { ApiProduct, HomeProductsData } from "./use-home-products";

// Re-export queryKeys with explicit names to avoid conflicts
export { queryKeys as categoriesQueryKeys } from "./use-categories";
export { queryKeys as homeProductsQueryKeys } from "./use-home-products";
