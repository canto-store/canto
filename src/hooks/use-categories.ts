"use client";

import { useQuery } from "@/lib/query";
import { api } from "@/lib/api";
import type { QueryConfig } from "@/lib/query";
import { QueryClient } from "@tanstack/react-query";

// API response types
export type Category = {
  id: number;
  name: string;
  icon: string | null;
  homepage: boolean;
  popular: boolean;
  include_in_nav: boolean;
};

export type Subcategory = {
  id: number;
  category_id: number;
  sub_category_title_id: number;
  name: string;
  slug: string;
};

export type SubcategoryTitle = {
  id: number;
  category_id: number;
  title: string;
  slug: string;
};

export type CategoriesApiResponse = {
  categories: Category[];
  subcategories: Subcategory[];
  subcategoriestitles: SubcategoryTitle[];
};

// Transformed data structure for easier consumption in the UI
export type ProcessedCategory = {
  id: number;
  name: string;
  icon: string | null;
  homepage: boolean;
  popular: boolean;
  include_in_nav: boolean;
  subcategoryTitles: Array<{
    id: number;
    title: string;
    slug: string;
    subcategories: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  }>;
};

export type CategoriesData = {
  all: Category[];
  popular: Category[];
  homepage: Category[];
  processed: ProcessedCategory[];
};

// Define query keys in a structured way
export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    details: (id: number) => [...queryKeys.categories.all, id] as const,
  },
};

// Process the raw API response into a more usable structure
function processCategories(data: CategoriesApiResponse): CategoriesData {
  // Create processed categories with nested subcategories
  const processed = data.categories.map((category) => {
    // Find all subcategory titles for this category
    const categoryTitles = data.subcategoriestitles.filter(
      (title) => title.category_id === category.id,
    );

    // Create the subcategory titles with their subcategories
    const subcategoryTitles = categoryTitles.map((title) => {
      // Find all subcategories for this title
      const titleSubcategories = data.subcategories.filter(
        (subcategory) => subcategory.sub_category_title_id === title.id,
      );

      return {
        id: title.id,
        title: title.title,
        slug: title.slug,
        subcategories: titleSubcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
        })),
      };
    });

    return {
      ...category,
      subcategoryTitles,
    };
  });

  return {
    all: data.categories,
    popular: data.categories.filter((category) => category.popular),
    homepage: data.categories.filter((category) => category.homepage),
    processed,
  };
}

// Fetch function separated for better testability and reuse
async function fetchCategories(): Promise<CategoriesData> {
  try {
    const response: CategoriesApiResponse = await api.get("/get-categories");

    // Validate response structure
    if (!response || !response.categories) {
      throw new Error("Invalid API response structure");
    }

    return processCategories(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Define query configuration for reusability
export const categoriesQueryConfig = {
  queryKey: queryKeys.categories.all,
  queryFn: fetchCategories,
  staleTime: 60 * 60 * 1000, // 1 hour - categories change less frequently
  gcTime: 2 * 60 * 60 * 1000, // 2 hours
};

export function useCategories(config?: QueryConfig<CategoriesData, Error>) {
  return useQuery<CategoriesData, Error>({
    ...categoriesQueryConfig,
    ...config,
  });
}

// For prefetching in route transitions or on app initialization
export function prefetchCategories(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: categoriesQueryConfig.queryKey,
    queryFn: categoriesQueryConfig.queryFn,
    staleTime: categoriesQueryConfig.staleTime,
    gcTime: categoriesQueryConfig.gcTime,
  });
}
