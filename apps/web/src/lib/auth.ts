import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { AuthResponse, LoginDto, RegisterDto } from "@canto/types/auth";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

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

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { data } = await api.post("/v2/auth/forgot-password", {
        email,
      });
      return data.message;
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) => {
      const { data } = await api.post("/v2/auth/reset-password", {
        token,
        password,
      });
      return data.message;
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });
};
