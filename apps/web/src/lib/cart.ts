import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth/use-auth";

interface AddToCartInput {
  variantId: number;
  quantity: number;
}

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      const response = await api.post("/cart/items", {
        variantId,
        quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    },
  });
};

export const useGetCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get("/cart/user");
      return response.data;
    },
    enabled: isAuthenticated,
  });
};

export const useDeleteFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId }: { variantId: number }) => {
      const response = await api.delete("/cart/items", { data: { variantId } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
