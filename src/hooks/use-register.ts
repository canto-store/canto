import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RegisterRequest } from "@/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      await api.post("/sign-up", data);
    },
    onError: (error) => {
      return error;
    },
  });
}

export default useRegister;
