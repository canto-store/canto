import { Brand } from "@/types/brand";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import api from "./api";
import { BrandFormValues } from "@/types/brand";
import { AxiosError } from "axios";

type UseMyBrandOptions = Omit<
  UseQueryOptions<Brand, Error, Brand, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

export const useMyBrand = (options?: UseMyBrandOptions) => {
  const queryClient = useQueryClient();
  return useQuery<Brand, Error, Brand, readonly unknown[]>({
    queryKey: ["my-brand"],
    queryFn: async () => {
      try {
        const { data } = await api.get<Brand>("/brand/my-brand");
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status !== 200) {
            queryClient.invalidateQueries({ queryKey: ["me"] });
          }
        }
        throw error;
      }
    },
    throwOnError: false,
    ...options,
  });
};

export const useBrands = (category?: string, enabled: boolean = true) =>
  useQuery<Brand[], Error>({
    queryKey: ["brands", category],
    queryFn: async () => {
      const endpoint = category ? `/brand?category=${category}` : "/brand";
      const { data } = await api.get<Brand[]>(endpoint);
      return data;
    },
    enabled, // ✅ conditionally enable/disable fetching
    staleTime: 30 * 60 * 1000, // 30 minutes
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
