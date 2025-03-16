import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginPage } from "@/components/auth/login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default async function Page() {
  return <LoginPage />;
}
