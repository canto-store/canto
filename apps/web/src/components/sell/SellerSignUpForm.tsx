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

// SignUp Form Schema
export const SignUpFormSchema = z
  .object({
    name: z.string().min(1, { message: "First name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().min(1, { message: "Phone Number is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

interface SellerSignUpFormProps {
  onSwitchToLogin: () => void;
}

export function SellerSignUpForm({ onSwitchToLogin }: SellerSignUpFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sellerRegister } = useAuth();
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    sellerRegister.mutate(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        phone_number: values.phone_number,
      },
      {
        onSuccess: () => {
          toast.success(t("auth.registerSuccess"));
          setIsSubmitting(false);
          router.refresh();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignUp)} className="w-full">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.name")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("sell.namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

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
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.phone")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder={t("sell.phonePlaceholder")}
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("auth.confirmPasswordLabel")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.confirmPasswordPlaceholder")}
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
          Sign Up
        </Button>
      </form>
      <Button
        type="button"
        className="mt-2 w-full"
        variant="outline"
        onClick={onSwitchToLogin}
      >
        Already have an account? Sign In
      </Button>
    </Form>
  );
}
