import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "./api";
import { toast } from "sonner";
import { WishlistItem } from "@canto/types/wishlist";

export function useGetWishlist() {
  return useSuspenseQuery<WishlistItem[], Error>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get("/wishlist");
      return data.data;
    },
    staleTime: Infinity,
  });
}

export const useToggleWishlistItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const { data } = await api.post("/wishlist/toggle", { productId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast.error("Failed to update wishlist");
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const { data } = await api.delete(`/wishlist/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Item removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove item from wishlist");
    },
  });
};
