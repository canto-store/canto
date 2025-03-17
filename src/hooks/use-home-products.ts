"use client";

import { useQuery } from "@/lib/query";
import { api } from "@/lib/api";
import type { QueryConfig } from "@/lib/query";
import type { HomeProductsData, Product } from "@/types";
import { QueryClient } from "@tanstack/react-query";
import { ApiProduct, HomeProductsApiResponse } from "@/types/product";

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

export const queryKeys = {
  products: {
    all: ["products"] as const,
    home: () => [...queryKeys.products.all, "home"] as const,
  },
};

async function fetchHomeProducts(): Promise<HomeProductsData> {
  try {
    const response: HomeProductsApiResponse =
      await api.get("/get-home-products");

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
