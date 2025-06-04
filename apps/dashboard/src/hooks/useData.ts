import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Products hook
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });
}

// Product status update mutation
export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: number;
      status: string;
    }) => api.updateProductStatus(productId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Brands hook
export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: api.getBrands,
  });
}

// Sellers hook
export function useSellers() {
  return useQuery({
    queryKey: ["sellers"],
    queryFn: api.getSellers,
  });
}
