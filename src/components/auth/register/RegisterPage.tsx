"use client";

import { RegisterForm } from "./RegisterForm";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function RegisterPage() {
  const t = useTranslations("auth");

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  function handleSuccess(email: string) {
    router.push(`/register/success?email=${email}&returnUrl=${returnUrl}`);
  }

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">{t("signUpTitle")}</h1>
          <p className="text-muted-foreground">{t("signUpDescription")}</p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-md">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
