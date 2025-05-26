"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth/use-auth";
import { useRouter } from "@/i18n/navigation";
import { parseApiError } from "@/lib/utils";
import { ErrorAlert } from "../ui/error-alert";

// Login Form Schema
export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;

interface SellerLoginFormProps {
  onSwitchToSignUp: () => void;
}

export function SellerLoginForm({ onSwitchToSignUp }: SellerLoginFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sellerLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    sellerLogin.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          toast.success(t("auth.loginSuccess"));
          setIsSubmitting(false);
          if (sellerLogin.data?.brandId) {
            router.push("/sell/products");
          } else {
            router.push("/sell/brand");
          }
        },
        onError: (error) => {
          setError(parseApiError(error));
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="w-full">
        <ErrorAlert message={error || ""} className="mb-4" />
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.email")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("sell.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("auth.password")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isSubmitting || form.formState.isSubmitting}
        >
          Sign In
        </Button>
        <Button
          type="button"
          className="mt-2 w-full"
          variant="outline"
          onClick={onSwitchToSignUp}
        >
          Don&apos;t have an account? Sign Up
        </Button>
      </form>
    </Form>
  );
}
