import { RegisterPage } from "@/components/auth/register";
import { AppLayout } from "@/components/layout";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: `${t("signUp")} - Canto`,
    description: t("signUpDescription"),
  };
}

export default async function Page() {
  return (
    <AppLayout>
      <RegisterPage />
    </AppLayout>
  );
}
