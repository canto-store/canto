import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import api from "./api";
import { toast } from "sonner";
import { Return } from "@/types/return";

export const useCreateReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderItemId,
      reason,
    }: {
      orderItemId: number;
      reason: string;
    }) => {
      const response = await api.post("/returns", { orderItemId, reason });
      return response.data;
    },
    onSuccess: (_data) => {
      queryClient.refetchQueries({ queryKey: ["order"] });
      toast.success("Return request created successfully");
    },
    onError: (res: any) => {
      toast.error(
        res.response?.data?.message || "Failed to create return request",
      );
    },
  });
};

export const useGetMyReturns = (take: number, skip: number) => {
  return useSuspenseQuery({
    queryKey: ["my-returns", take, skip],
    queryFn: async () => {
      const response = await api.get<{ returnRequests: Return[] }>(`/returns`, {
        params: { take, skip },
      });
      return response.data.returnRequests;
    },
  });
};
