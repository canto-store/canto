import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import api from "@/lib/api";
import { Seller, User } from "@/types/user";
import { useAuthStore } from "@/stores/auth-store";

export const useUserQuery = () => {
  const { setUser } = useAuthStore();
  
  return useQuery<User | Seller | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await api.get<User | Seller>("/auth/me");
        if (response.status === 200) {
          const user = response.data;
          setUser(user);
          return user;
        }
        setUser(null);
        return null;
      } catch {
        setUser(null);
        return null;
      }
    },
    initialData: null,
    staleTime: 60 * 60 * 1000, // 1 hour
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
  const { logout } = useAuthStore();

  return useMutation<void, Error, unknown, unknown>({
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSuccess: () => {
      logout();
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["address"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });
};

export const useAuth = () => {
  const authStore = useAuthStore();
  const userQuery = useUserQuery();
  const login = useLogin();
  const sellerLogin = useSellerLogin();
  const register = useRegister();
  const sellerRegister = useSellerRegister();
  const logout = useLogout();

  return {
    ...authStore,
    userQuery,
    login,
    sellerLogin,
    register,
    sellerRegister,
    logout,
  };
};