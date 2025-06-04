import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Products hook
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
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