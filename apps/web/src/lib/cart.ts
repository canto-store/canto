import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { Cart } from "@canto/types/cart";
import { toast } from "sonner";
interface AddToCartInput {
  variantId: number;
  quantity: number;
}

export const useGetCart = () => {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      return await api
        .get<Cart>("/cart/user")
        .then((res) => res.data)
        .catch(() => {
          return { items: [], count: 0, price: 0 } as Cart;
        });
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      const response = await api.put("/cart/items", {
        variantId,
        quantity,
      });
      toast("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      return response.data;
    },
  });
};

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId }: { variantId: number }) => {
      const response = await api.delete("/cart/items", {
        data: { variantId },
      });
      toast("Removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      return response.data;
    },
  });
};
