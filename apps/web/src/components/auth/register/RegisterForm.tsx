"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/hooks/auth";
import { parseApiError } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCartStore, useSyncCart } from "@/lib/cart";

// Define the form validation schema with Zod
const registerFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().min(11, { message: "Phone number is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registerFormSchema>;

export function RegisterForm({
  switchToLogin,
  onClose,
}: {
  switchToLogin?: () => void;
  onClose?: () => void;
}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { register: registerMutation } = useAuth();
  const { items, addItems } = useCartStore();
  const { mutateAsync: syncCart } = useSyncCart();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    registerMutation
      .mutateAsync({
        email: data.email,
        password: data.password,
        name: data.name,
        phone_number: data.phone_number,
      })
      .then(() => {
        setIsPending(false);
        setError(null);
        toast.success(t("registerSuccess"));
        syncCart(
          items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        ).then((data) => {
          addItems(data);
        });
        if (onClose) {
          onClose();
        } else {
          router.push("/");
        }
      })
      .catch((error) => {
        setIsPending(false);
        setError(parseApiError(error));
        toast.error(t("registrationError"));
      });
  };

  const handleSwitchToLogin = () => {
    if (switchToLogin) {
      switchToLogin();
    } else {
      router.push("/login");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert message={error || null} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("nameLabel")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("namePlaceholder")}
                  disabled={isPending}
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("emailLabel")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  disabled={isPending}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("phoneNumber")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  disabled={isPending}
                  autoComplete="tel"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("passwordLabel")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  disabled={isPending}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("confirmPasswordLabel")}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  disabled={isPending}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-6 w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("signingUp")}
            </>
          ) : (
            t("signUpButton")
          )}
        </Button>

        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-sm font-normal"
            onClick={handleSwitchToLogin}
            disabled={isPending}
          >
            {t("alreadyHaveAccount")} {t("signIn")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
