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
    <div className="h-[calc(100vh-6.5rem-5rem)] py-12">
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold">{t("signUpTitle")}</h1>
          <p>{t("signUpDescription")}</p>
        </div>
        <div className="rounded-lg p-6 shadow-lg">
          <RegisterForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
