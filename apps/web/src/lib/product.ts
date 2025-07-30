import { useMutation, useQuery } from "@tanstack/react-query";
import {
  HomeProducts,
  ProductDetails,
  ProductSummary,
  APIError,
  ProductOption,
  SavedProductForm,
  SubmitProductFormValues,
  ProductByBrand,
} from "@/types";
import axios from "axios";
import api from "./api";

export const useProduct = (slug: string) => {
  return useQuery<ProductDetails, Error>({
    queryKey: ["product", slug],
    queryFn: async () => {
      try {
        const { data } = await api.get<ProductDetails>(`/product/slug/${slug}`);
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = (error.response?.data as APIError)?.message;
          if (message) throw new Error(message);
        }
        throw new Error("Failed to fetch data");
      }
    },
  });
};

export const useHomeProducts = () =>
  useQuery<HomeProducts, Error>({
    queryKey: ["home-products"],
    queryFn: async () => {
      try {
        const { data } = await api.get<HomeProducts>("/product/home-products");
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = (error.response?.data as APIError)?.message;
          if (message) throw new Error(message);
        }
        throw new Error("Failed to fetch data");
      }
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
export const useProductOptions = () =>
  useQuery<ProductOption[], Error>({
    queryKey: ["products-options"],
    queryFn: async () => {
      try {
        const { data } = await api.get<ProductOption[]>("/product/options");
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = (error.response?.data as APIError)?.message;
          if (message) throw new Error(message);
        }
        throw new Error("Failed to fetch data");
      }
    },
  });

export const useSubmitProduct = () =>
  useMutation<SavedProductForm, Error, SubmitProductFormValues>({
    mutationFn: async (product: SubmitProductFormValues) => {
      const { data } = await api.post<SavedProductForm>(
        "/product/submit",
        product,
      );
      return data;
    },
  });

export const useProductsByBrand = (brandId: number) =>
  useQuery<ProductByBrand[], Error>({
    queryKey: ["products-by-brand", brandId],
    queryFn: async () => {
      const { data } = await api.get<ProductByBrand[]>(
        `/product/brands/${brandId}`,
      );
      return data;
    },
  });

export interface ProductSearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  colors?: string;
  sizes?: string;
  inStock?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export interface ProductSearchResult {
  products: ProductSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useProductSearch = (params: ProductSearchParams) =>
  useQuery<ProductSearchResult, Error>({
    queryKey: ["product-search", params],
    queryFn: async () => {
      try {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });

        const { data } = await api.get<ProductSearchResult>(
          `/product/search?${searchParams.toString()}`,
        );
        return data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = (error.response?.data as APIError)?.message;
          if (message) throw new Error(message);
        }
        throw new Error("Failed to search products");
      }
    },
    enabled: Object.values(params).some(
      (value) => value !== undefined && value !== "",
    ),
  });
