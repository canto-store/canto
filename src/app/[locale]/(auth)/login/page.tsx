import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppLayout } from "@/components/layout/AppLayout";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("loginTitle"),
    description: t("loginDescription"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");

  return (
    <AppLayout>
      <div className="mx-auto max-w-[400px]">
        <div className="mb-8 space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("loginTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("loginSubtitle")}</p>
        </div>
        <div className="border-border rounded-lg border p-8">
          <LoginForm />
        </div>
      </div>
    </AppLayout>
  );
}
