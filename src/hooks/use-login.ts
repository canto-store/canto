import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoginRequest } from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post("/login", data);
      return response;
    },
  });
}

export default useLogin;
