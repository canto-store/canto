import { SignUpForm } from "@/components/auth/SignUpForm";
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

export default async function SignUpPage() {
  const t = await getTranslations("auth");

  return (
    <AppLayout>
      <div className="py-12">
        <div className="container mx-auto max-w-md px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">{t("signUpTitle")}</h1>
            <p className="text-muted-foreground">{t("signUpDescription")}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-md">
            <SignUpForm />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
