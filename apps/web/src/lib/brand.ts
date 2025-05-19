import { Brand } from "@/types/brand";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "./api";
import { BrandFormValues } from "@/types/brand";

type UseMyBrandOptions = Omit<
  UseQueryOptions<Brand, Error, Brand, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export const useMyBrand = (options?: UseMyBrandOptions) =>
  useQuery<Brand, Error, Brand, readonly unknown[]>({
    queryKey: ["my-brand"],
    queryFn: async () => {
      const { data } = await api.get<Brand>("/brand/my-brand");
      return data;
    },
    throwOnError: false,
    staleTime: 0,
    ...options,
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
