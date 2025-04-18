"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/providers/auth/use-auth";
import { parseApiError } from "@/lib/utils";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm({
  // onSuccess,
  switchToLogin,
}: {
  onSuccess?: (email: string) => void;
  switchToLogin?: () => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const t = useTranslations("auth");
  const router = useRouter();
  const { register: registerMutation } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: "",
      },
      {
        onSuccess: () => {
          setIsPending(false);
          setError(null);
          toast.success(t("registrationSuccess"));
          router.push("/");
        },
        onError: (error) => {
          setIsPending(false);
          setError(parseApiError(error));
          toast.error(t("registrationError"));
        },
      },
    );
  };

  const handleSwitchToLogin = () => {
    if (switchToLogin) {
      switchToLogin();
    } else {
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ErrorAlert message={error || null} />

      <FormInput
        id="name"
        label={t("nameLabel")}
        type="text"
        placeholder={t("namePlaceholder")}
        disabled={isPending}
        required
        error={errors.name}
        customErrorMessage={t("errors.firstNameRequired")}
        {...register("name", {
          required: t("nameRequired"),
        })}
      />

      <FormInput
        id="email"
        label={t("emailLabel")}
        type="email"
        placeholder={t("emailPlaceholder")}
        autoComplete="email"
        disabled={isPending}
        required
        error={errors.email}
        customErrorMessage={t("errors.emailRequired")}
        {...register("email", {
          required: t("emailRequired"),
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: t("errors.emailInvalid"),
          },
        })}
      />

      <FormInput
        id="password"
        label={t("passwordLabel")}
        type="password"
        placeholder={t("passwordPlaceholder")}
        autoComplete="new-password"
        disabled={isPending}
        required
        error={errors.password}
        customErrorMessage={t("errors.passwordRequired")}
        {...register("password", {
          required: t("passwordRequired"),
          minLength: {
            value: 8,
            message: t("errors.passwordTooShort"),
          },
        })}
      />

      <FormInput
        id="confirmPassword"
        label={t("confirmPasswordLabel")}
        type="password"
        placeholder={t("confirmPasswordPlaceholder")}
        autoComplete="new-password"
        disabled={isPending}
        required
        error={errors.confirmPassword}
        customErrorMessage={t("passwordsDoNotMatch")}
        {...register("confirmPassword", {
          required: t("confirmPasswordRequired"),
          validate: (value) =>
            value === watch("password") || t("passwordsDoNotMatch"),
        })}
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
  );
}
