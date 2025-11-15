import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "./api";
import { Order } from "@/types";

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

export const useGetMyOrders = ({
  take,
  skip,
}: {
  take: number;
  skip: number;
}) => {
  return useSuspenseQuery({
    queryKey: ["my-orders", { take, skip }],
    queryFn: async () => {
      const response = await api.get<{ orders: Order[]; totalPages: number }>(
        `/orders/my-orders?take=${take}&skip=${skip}`,
      );
      return response.data;
    },
  });
};
