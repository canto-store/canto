import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AuthResponse, LoginDto, RegisterDto } from "@canto/types/auth";
import { useUserStore } from "@/stores/useUserStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<AuthResponse>("/v2/auth/login", {
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.refetchQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setAuth = useUserStore((s) => s.setAuth);

  return useMutation<AuthResponse, Error, RegisterDto>({
    mutationFn: async ({
      email,
      password,
      name,
      phone_number,
    }: RegisterDto) => {
      const { data } = await api.post<AuthResponse>("/v2/auth/register", {
        name,
        email,
        phone_number,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data);
      queryClient.refetchQueries({ queryKey: ["cart"] });
    },
  });
};
