import { AuthContext } from "./auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import api from "@/lib/api";
import { Seller, User } from "@/types/user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const userQuery = useQuery<User | Seller | null>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<User | Seller>("/auth/me");
      if (response.status === 200) return response.data;
      return null;
    },
    initialData: null,
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: false,
    throwOnError: false,
  });

  const register = useMutation<User, Error, RegisterRequest>({
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const sellerRegister = useMutation<User, Error, RegisterRequest>({
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const login = useMutation<User, Error, LoginRequest>({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<User>("/auth/login", { email, password });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
  const logout = useMutation<void, Error, unknown, unknown>({
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["address"] });
      queryClient.removeQueries({ queryKey: ["cart"] });
    },
  });

  const sellerLogin = useMutation<Seller, Error, LoginRequest>({
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data,
        login,
        logout,
        userQuery,
        register,
        sellerLogin,
        sellerRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
