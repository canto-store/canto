import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import api from "@/lib/api";
import { Seller, User } from "@/types/user";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart";
import { AxiosError } from "axios";

export const useUserQuery = () => {
  const { setUser, clearUser, setLoading } = useAuthStore();

  return useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      setLoading(true);
      return await api
        .get<User>("/auth/me")
        .then((response) => {
          setUser(response.data);
          return response.data;
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            if (error.response?.status !== 200) {
              clearUser();
              return null;
            }
          }
          throw error;
        })
        .finally(() => setLoading(false));
    },
    initialData: null,
    retry: false,
    throwOnError: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation<User, Error, LoginRequest>({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<User>("/auth/login", { email, password });
      return data;
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useSellerLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

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
    onSuccess: (seller) => {
      setUser(seller);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

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
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useSellerRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

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
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSuccess: () => {
      clearUser();
      clearCart();
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    },
  });
};
