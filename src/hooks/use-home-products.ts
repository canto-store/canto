"use client";

import { useQuery } from "@/lib/query";
import { fetchData } from "@/lib/api";
import type { QueryConfig } from "@/lib/query";
import type { Product } from "@/types";
import { QueryClient } from "@tanstack/react-query";

// API response type from the backend
export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  short_desc: string;
  price: number;
  sale_price: number | null;
  review: number;
  ratings: number;
  until: string | null;
  stock: number;
  top: boolean;
  featured: boolean;
  new: boolean;
  best_seller: boolean;
  best_deal: boolean;
  new_arrival: boolean;
  author: string;
  sold: number;
  category: Array<{
    name: string;
    slug: string;
  }>;
  sm_pictures: Array<{ url: string }>;
};

export type HomeProductsApiResponse = {
  products: {
    Fashion: ApiProduct[];
    sections: Record<string, unknown>[];
  };
};

export type HomeProductsData = {
  featured: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
};

// Transform API product to app Product type
function transformProduct(apiProduct: ApiProduct): Product {
  return {
    name: apiProduct.name,
    brand: apiProduct.author || "Unknown",
    price: apiProduct.price,
    image: apiProduct.sm_pictures[0]?.url || "",
    translationKey: {
      name: `productItems.${apiProduct.slug}`,
      brand: `brands.${apiProduct.author.toLowerCase().replace(/\s+/g, "")}`,
    },
  };
}

// Define query keys in a structured way
export const queryKeys = {
  products: {
    all: ["products"] as const,
    home: () => [...queryKeys.products.all, "home"] as const,
  },
};

// Fetch function separated for better testability and reuse
async function fetchHomeProducts(): Promise<HomeProductsData> {
  try {
    const response =
      await fetchData<HomeProductsApiResponse>("get-home-products");

    // Validate response structure
    if (!response || !response.products || !response.products.Fashion) {
      throw new Error("Invalid API response structure");
    }

    // Filter products based on their flags
    const allProducts = response.products.Fashion;

    return {
      featured: allProducts
        .filter((product) => product.featured)
        .map(transformProduct),
      newArrivals: allProducts
        .filter((product) => product.new_arrival)
        .map(transformProduct),
      bestSellers: allProducts
        .filter((product) => product.best_seller)
        .map(transformProduct),
    };
  } catch (error) {
    console.error("Error fetching home products:", error);
    throw error;
  }
}

// Define query configuration for reusability
export const homeProductsQueryConfig = {
  queryKey: queryKeys.products.home(),
  queryFn: fetchHomeProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
};

export function useHomeProducts(config?: QueryConfig<HomeProductsData, Error>) {
  return useQuery<HomeProductsData, Error>({
    ...homeProductsQueryConfig,
    ...config,
  });
}

// For prefetching in route transitions or on app initialization
export function prefetchHomeProducts(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: homeProductsQueryConfig.queryKey,
    queryFn: homeProductsQueryConfig.queryFn,
    staleTime: homeProductsQueryConfig.staleTime,
    gcTime: homeProductsQueryConfig.gcTime,
  });
}
