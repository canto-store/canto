import React from "react";
import { LoginForm } from "./LoginForm";
import { useTranslations } from "next-intl";

export function LoginPage({ redirectUrl }: { redirectUrl?: string }) {
  const t = useTranslations("auth");

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold">{t("loginTitle")}</h1>
          <p>{t("loginDescription")}</p>
        </div>
        <div className="rounded-lg p-6 shadow-lg">
          <LoginForm redirectUrl={redirectUrl ?? "/"} />
        </div>
      </div>
    </div>
  );
}
