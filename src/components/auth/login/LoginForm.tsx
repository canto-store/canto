"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/auth/use-auth";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { LoginRequest } from "@/types/auth";
interface LoginFormProps {
  onClose?: () => void;
  switchToRegister?: () => void;
}

export function LoginForm({ onClose, switchToRegister }: LoginFormProps) {
  const { register, handleSubmit } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    setIsLoading(true);
    await login
      .mutateAsync(data)
      .then(() => {
        router.push(returnUrl);
        if (onClose) {
          onClose();
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSwitchToRegister = () => {
    if (switchToRegister) {
      switchToRegister();
    } else {
      router.push(`/register?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ErrorAlert message={error} />

      <FormInput
        id="email"
        label={t("auth.emailLabel")}
        type="email"
        placeholder={t("auth.emailPlaceholder")}
        {...register("email")}
        required
        autoComplete="email"
        disabled={isLoading}
        customErrorMessage={t("form.fieldRequired")}
      />

      <FormInput
        id="password"
        label={t("auth.passwordLabel")}
        type="password"
        placeholder={t("auth.passwordPlaceholder")}
        {...register("password")}
        required
        autoComplete="current-password"
        disabled={isLoading}
        customErrorMessage={t("form.fieldRequired")}
      />

      <div className="flex items-center justify-between pt-2">
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
      </div>

      <div className="text-muted-foreground before:bg-border after:bg-border relative mt-6 text-center text-sm before:absolute before:top-1/2 before:left-0 before:h-px before:w-[calc(50%-1rem)] after:absolute after:top-1/2 after:right-0 after:h-px after:w-[calc(50%-1rem)]">
        <span className="bg-background px-4">{t("auth.noAccount")}</span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleSwitchToRegister}
        disabled={isLoading}
      >
        {t("auth.registerLink")}
      </Button>
    </form>
  );
}
