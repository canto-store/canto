import { useQuery } from "@tanstack/react-query";
import { HomeProducts, ProductDetails, APIError } from "@/types";
import axios from "axios";
import api from "./api";

export const useProduct = (slug: string) => {
  return useQuery<ProductDetails, Error>({
    queryKey: ["product", slug],
    queryFn: async (slug) => {
      try {
        const { data } = await api.get<ProductDetails>(`/product/${slug}`);
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
        const { data } = await api.get<HomeProducts>("/home-products");
        return {
          bestDeals: data.bestDeals,
          bestSellers: data.bestSellers,
          newArrivals: data.newArrivals,
        };
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const message = (error.response?.data as APIError)?.message;
          if (message) throw new Error(message);
        }
        throw new Error("Failed to fetch data");
      }
    },
  });
