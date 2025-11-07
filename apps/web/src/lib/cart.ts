import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { Cart } from "@canto/types/cart";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useUserQuery } from "./auth";
interface AddToCartInput {
  variantId: number;
  quantity: number;
}

export const useGetCart = () => {
  const { data: user, isLoading: isUserLoading } = useUserQuery();

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      return await api
        .get<Cart>("/cart/user")
        .then((res) => res.data)
        .catch(() => ({ items: [], count: 0, price: 0 }));
    },
    enabled: !!user && !isUserLoading,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      return await api
        .put("/cart/items", {
          variantId,
          quantity,
        })
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return res.data;
        })
        .catch((err) => {
          const message =
            err instanceof AxiosError &&
            err?.response?.status != null &&
            err.response.status < 500
              ? err.message
              : "Failed to add to cart";
          toast.error(message);
        });
    },
  });
};

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId }: { variantId: number }) => {
      return await api
        .delete("/cart/items", {
          data: { variantId },
        })
        .then((res) => {
          toast.success("Removed from cart");
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          return res.data;
        })
        .catch(() => {
          toast.error("Failed to remove from cart");
        });
    },
  });
};
