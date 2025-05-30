import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { UserAddress, UserAddressForm } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (address: UserAddressForm) => {
      const response = await api.post("/address", address);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
};

export const useGetAddress = () => {
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const response = await api.get<UserAddress[]>("/address");
      return response.data;
    },
  });
};
