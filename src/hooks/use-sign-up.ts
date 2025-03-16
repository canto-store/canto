import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { postData, ApiError } from "@/lib/api";

// Define the request type based on the form fields in SignUpForm.tsx
export interface SignUpRequest extends Record<string, unknown> {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

// Define the response type
export interface SignUpResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Define the error type
export interface SignUpError {
  status: number;
  message: string;
  errors?: Record<string, string | string[]>;
}

export function useSignUp() {
  const t = useTranslations("auth");

  const mutation = useMutation({
    mutationFn: async (data: SignUpRequest) => {
      const response = await postData<SignUpResponse, SignUpRequest>(
        "sign-up",
        data,
      );
      return response;
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        return {
          status: error.status,
          message: error.isServerError() ? t("registerError") : error.message,
          errors: error.errors,
        };
      }
      throw new Error(t("serverError"));
    },
  });

  return {
    ...mutation,
    isSuccess: mutation.isSuccess,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    signUp: mutation.mutate,
    signUpAsync: mutation.mutateAsync,
  };
}

// Export the hook as default
export default useSignUp;
