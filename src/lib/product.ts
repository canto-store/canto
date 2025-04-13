import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL, HOME_PRODUCTS_URL } from "./config";
import { HomeProducts, ProductDetails } from "@/types";
import axios from "axios";

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: [slug],
    queryFn: async () => {
      return axios
        .get<ProductDetails>(`${BACKEND_URL}/api/product/${slug}`)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          throw new Error(
            error.response?.data?.message ?? "Failed to fetch data",
          );
        });
    },
  });
};

export const useHomeProducts = () =>
  useQuery<HomeProducts, Error>({
    queryKey: ["home_products"],
    queryFn: async () => {
      return axios
        .get<HomeProducts>(HOME_PRODUCTS_URL)
        .then((res) => res.data)
        .catch((error) => {
          throw new Error(
            error.response?.data?.message ?? "Failed to fetch data",
          );
        });
    },
  });
