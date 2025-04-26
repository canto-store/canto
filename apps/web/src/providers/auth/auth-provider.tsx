import { AuthContext } from "./auth-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import api from "@/lib/api";

type User = {
  firstName: string;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User | null | undefined>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get<User>("/me");
      if (response.status === 200) return response.data;
      if (response.status === 401) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });

  const register = useMutation<User, Error, RegisterRequest>({
    mutationFn: async ({ email, password, name, phoneNumber }) => {
      const { data } = await api.post<User>("/register", {
        email,
        password,
        name,
        phoneNumber,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const login = useMutation<User, Error, LoginRequest>({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post<User>("/login", { email, password });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
  const logout = useMutation<void, Error, unknown, unknown>({
    mutationFn: async () => {
      const { data } = await api.post("/logout");
      return data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });

  const isAuthenticated = !!userQuery.data;

  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data,
        isAuthenticated,
        login,
        logout,
        userQuery,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
