import React from "react";
import { LoginForm } from "./LoginForm";
import { useTranslations } from "next-intl";

export function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("loginTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("loginSubtitle")}</p>
        </div>
        <div className="rounded-lg p-6 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
