"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLogin } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { parseApiError } from "@/lib/utils";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onClose?: () => void;
  switchToRegister?: () => void;
  redirectUrl?: string;
}

export function LoginForm({
  onClose,
  switchToRegister,
  redirectUrl = "/",
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations();
  const { mutateAsync: login } = useLogin();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    await login(data)
      .then(() => {
        router.push(redirectUrl);
        if (onClose) {
          onClose();
        }
        toast.success(t("auth.loginSuccess"));
      })
      .catch((error) => {
        setError(parseApiError(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSwitchToRegister = () => {
    if (switchToRegister) {
      switchToRegister();
    } else {
      router.push(`/register`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ErrorAlert message={error} />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("auth.emailLabel")}
                <span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  disabled={isLoading}
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
                {t("auth.passwordLabel")}
                <span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("auth.passwordPlaceholder")}
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-sm font-normal"
            onClick={() => router.push("/forgot-password")}
            disabled={isLoading}
          >
            {t("auth.forgotPassword")}
          </Button>
          <Button type="submit" disabled={isLoading} className="w-24">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("auth.loginButton")
            )}
          </Button>
        </div> */}

        <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("auth.loginButton")
          )}
        </Button>

        <div className="mt-6 text-center text-sm">
          <span className="bg-background px-4">{t("auth.noAccount")}</span>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={handleSwitchToRegister}
            disabled={isLoading}
          >
            {t("auth.registerLink")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
