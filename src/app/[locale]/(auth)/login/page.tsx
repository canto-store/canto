import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthenticationHandler } from "@/components/auth/AuthenticationHandler";

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
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("loginTitle")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("loginSubtitle")}
            </p>
          </div>
          <div className="border-border bg-card rounded-lg border p-6 shadow-sm sm:p-8">
            <AuthenticationHandler />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
