"use client";

import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function RegisterSuccess() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const email = searchParams.get("email") || "";

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{t("signUpSuccess")}</h3>
        <p className="text-muted-foreground">{t("verificationEmailSent")}</p>
        <div className="mt-2 rounded-md bg-blue-50 p-3 text-blue-800">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <p>{t("verificationEmailSentTo", { email })}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4">
        <Button
          onClick={() =>
            router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
          }
          className="w-full"
        >
          {t("goToLogin")}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="w-full"
        >
          {t("goToHome")}
        </Button>
      </div>
    </div>
  );
}
