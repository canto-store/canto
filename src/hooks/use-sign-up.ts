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

/**
 * Hook for handling user sign-up with proper error handling
 */
export function useSignUp() {
  const t = useTranslations("auth");

  return useMutation<SignUpResponse, SignUpError, SignUpRequest>({
    mutationFn: async (data: SignUpRequest) => {
      try {
        // Use the postData utility function for the API call
        return await postData<SignUpResponse, SignUpRequest>("sign-up", data);
      } catch (error) {
        // Handle errors from API calls
        if (error instanceof ApiError) {
          // Create a structured error object using the ApiError properties
          const signUpError: SignUpError = {
            status: error.status,
            message: error.isClientError()
              ? t("registerError") ||
                "Registration failed. Please check your information and try again."
              : t("serverError") ||
                "Something went wrong. Please try again later.",
            errors: error.errors,
          };

          throw signUpError;
        }

        // For any other type of error
        const signUpError: SignUpError = {
          status: 500,
          message:
            t("serverError") || "Something went wrong. Please try again later.",
        };

        throw signUpError;
      }
    },
    onError: (error) => {
      console.log("Sign-up error:", error);
    },
  });
}

// Export the hook as default
export default useSignUp;
