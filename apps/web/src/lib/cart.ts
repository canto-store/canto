import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { Cart } from "@canto/types/cart";
import { toast } from "sonner";
import { useUserStore } from "@/stores/useUserStore";
interface AddToCartInput {
  variantId: number;
  quantity: number;
}

export const useGetCart = () => {
  const { isAuthenticated } = useUserStore();
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      return await api.get<Cart>("/cart/user").then((res) => res.data);
    },
    enabled: isAuthenticated,
    placeholderData: { items: [], count: 0, price: 0 },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { user, setAuth } = useUserStore();
  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      if (user === null) {
        await api.post("/v2/auth/create-guest").then((res) => {
          setAuth(res.data);
        });
      }
      return await api.put("/cart/items", {
        variantId,
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Failed to add to cart");
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
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        })
        .catch(() => {
          toast.error("Failed to remove from cart");
        });
    },
  });
};
