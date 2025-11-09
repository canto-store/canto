import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const useCategories = () =>
  useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories");
      return data.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.image,
        slug: category.slug,
        aspect: category.aspect,
      }));
    },
  });

export const useAllCategories = () =>
  useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/categories/all");
      return data.map((category) => ({
        id: category.id,
        name: category.name,
        image: category.image,
        slug: category.slug,
        aspect: category.aspect,
      }));
    },
    staleTime: Infinity,
  });
