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
      }));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
