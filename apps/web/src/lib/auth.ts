import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import api from "@/lib/api";
import { Seller, User } from "@/types/user";
import { toast } from "sonner";

export const useUserQuery = () => {
  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      return await api.get<User>("/auth/me").then((response) => {
        return response.data;
      });
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, LoginRequest>({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<User>("/auth/login", { email, password });
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["me"] });
      queryClient.refetchQueries({ queryKey: ["cart"] });
    },
  });
};

export const useSellerLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<Seller, Error, LoginRequest>({
    mutationFn: async ({ email, password }) => {
      try {
        const { data } = await api.post<Seller>("/seller/login", {
          email,
          password,
        });
        return data;
      } catch (error) {
        console.error("Seller login error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["me"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, RegisterRequest>({
    mutationFn: async ({ email, password, name, phone_number }) => {
      const { data } = await api.post<User>("/auth/register", {
        name,
        email,
        phone_number,
        password,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["me", "cart"] });
    },
  });
};

export const useSellerRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, RegisterRequest>({
    mutationFn: async ({ email, password, name, phone_number }) => {
      const { data } = await api.post<User>("/seller/register", {
        name,
        email,
        phone_number,
        password,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["me"] });
      queryClient.refetchQueries({ queryKey: ["cart"] });
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    },
  });
};
