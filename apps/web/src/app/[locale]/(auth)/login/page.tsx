import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default async function Page() {
  const t = await getTranslations("auth");

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold">{t("loginTitle")}</h1>
          <p>{t("loginDescription")}</p>
        </div>
        <div className="rounded-lg p-6 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
