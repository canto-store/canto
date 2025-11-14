import { Brand } from "@/types/brand";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { BrandFormValues } from "@/types/brand";

export const useMyBrand = () => {
  return useQuery<Brand, Error, Brand, readonly unknown[]>({
    queryKey: ["my-brand"],
    queryFn: async () => {
      const { data } = await api.get<Brand>("/brand/my-brand");
      return data;
    },
    retry: false,
  });
};

export const useBrands = (category?: string) =>
  useQuery<Brand[], Error>({
    queryKey: ["brands", category],
    queryFn: async () => {
      const endpoint = category ? `/brand?category=${category}` : "/brand";
      const { data } = await api.get<Brand[]>(endpoint);
      return data;
    },
  });

export const useSubmitBrand = () =>
  useMutation<Brand, Error, BrandFormValues>({
    mutationFn: async ({ name, description, email, instagramUrl }) => {
      const { data } = await api.post<Brand>("/brand", {
        name,
        email,
        description,
        instagram_url: instagramUrl,
      });
      return data;
    },
  });
