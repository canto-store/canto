"use client";

import { useQuery } from "@/lib/query";
import { fetchData } from "@/lib/api";
import type { QueryConfig } from "@/lib/query";
import type { Product } from "@/types";

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
    sections: any[];
  };
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

export const homeProductsQueryKey = ["home-products"] as const;

export function useHomeProducts(
  config?: QueryConfig<
    {
      featured: Product[];
      newArrivals: Product[];
      bestSellers: Product[];
    },
    Error
  >,
) {
  return useQuery({
    queryKey: homeProductsQueryKey,
    queryFn: async () => {
      try {
        const response = await fetchData<HomeProductsApiResponse>(
          "https://api.canto-store.com/get-home-products",
        );

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
    },
    ...config,
  });
}
