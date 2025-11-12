import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const useSizes = () =>
  useQuery<{ id: string; value: string }[], Error>({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data } =
        await api.get<{ id: string; value: string }[]>("/options/sizes");
      return data.map((size) => ({
        id: size.id,
        value: size.value,
      }));
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const usePriceRange = () =>
  useQuery<[number, number], Error>({
    queryKey: ["priceRange"],
    queryFn: async () => {
      const { data } = await api.get<[number, number]>("/product/price-range");
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
