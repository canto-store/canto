import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (addressId: number) => {
      const response = await api.post("/orders", { addressId });
      return response.data.data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const response = await api.get("/orders/my-orders");
      return response.data.data.orders;
    },
  });
};
