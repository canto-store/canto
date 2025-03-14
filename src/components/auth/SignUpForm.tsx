"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSignUp, type SignUpRequest } from "@/hooks";

interface SignUpFormProps {
  onSuccess?: () => void;
}

interface FieldError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const t = useTranslations("auth");
  const router = useRouter();
  const signUpMutation = useSignUp();

  const validateForm = (): boolean => {
    const errors: FieldError = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = t("nameRequired");
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = t("emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t("errors.emailInvalid");
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = t("passwordRequired");
      isValid = false;
    } else if (password.length < 8) {
      errors.password = t("errors.passwordTooShort");
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = t("passwordsDoNotMatch");
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const signUpData: SignUpRequest = {
        email,
        password,
        name,
      };

      await signUpMutation.mutateAsync(signUpData);

      toast.success(t("signUpSuccess"));
      setIsSuccess(true);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "status" in err &&
        "message" in err
      ) {
        const errorObj = err as {
          status: number;
          message: string;
          errors?: Record<string, string | string[]>;
        };

        if (errorObj.status >= 400 && errorObj.status < 500) {
          setError(errorObj.message || t("signUpError"));

          if (errorObj.errors) {
            const apiErrors: Record<string, string> = {};
            Object.entries(errorObj.errors).forEach(([key, messages]) => {
              apiErrors[key] = Array.isArray(messages)
                ? messages[0]
                : (messages as string);
            });
            setFieldErrors({ ...fieldErrors, ...apiErrors });
          }
        } else {
          setError(t("serverError"));
        }
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t("signUpSuccess")}</h3>
          <p className="text-muted-foreground">{t("verificationEmailSent")}</p>
          <div className="mt-2 rounded-md bg-blue-50 p-3 text-blue-800">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <p>{t("verificationEmailSentTo", { email })}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => router.push("/login")} className="w-full">
            {t("goToLogin")}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            {t("goToHome")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorAlert message={error} />

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {t("nameLabel")}
        </Label>
        <Input
          id="name"
          type="text"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={signUpMutation.isPending}
          className={cn(
            "h-10",
            fieldErrors.name && "border-red-500 focus-visible:ring-red-500",
          )}
          aria-invalid={!!fieldErrors.name}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          {t("emailLabel")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={signUpMutation.isPending}
          className={cn(
            "h-10",
            fieldErrors.email && "border-red-500 focus-visible:ring-red-500",
          )}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          {t("passwordLabel")}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={signUpMutation.isPending}
          className={cn(
            "h-10",
            fieldErrors.password && "border-red-500 focus-visible:ring-red-500",
          )}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">
          {t("confirmPasswordLabel")}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          disabled={signUpMutation.isPending}
          className={cn(
            "h-10",
            fieldErrors.confirmPassword &&
              "border-red-500 focus-visible:ring-red-500",
          )}
          aria-invalid={!!fieldErrors.confirmPassword}
        />
        {fieldErrors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {fieldErrors.confirmPassword}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-sm font-normal"
          onClick={() => router.push("/login")}
          disabled={signUpMutation.isPending}
        >
          {t("alreadyHaveAccount")}
        </Button>
        <Button
          type="submit"
          disabled={signUpMutation.isPending}
          className="w-24"
        >
          {signUpMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("signUpButton")
          )}
        </Button>
      </div>
    </form>
  );
}
