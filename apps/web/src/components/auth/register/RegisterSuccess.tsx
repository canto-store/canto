"use client";

import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function RegisterSuccess({
  switchToLogin,
  onClose,
}: {
  switchToLogin?: () => void;
  onClose?: () => void;
}) {
  const t = useTranslations("auth");
  const router = useRouter();

  const handleGoToLogin = () => {
    if (switchToLogin) {
      switchToLogin();
    } else {
      router.push(`/login}`);
    }
  };

  const handleGoToHome = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

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
            <p>Register Success</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4">
        <Button onClick={handleGoToLogin} className="w-full">
          {t("goToLogin")}
        </Button>
        <Button variant="outline" onClick={handleGoToHome} className="w-full">
          {t("goToHome")}
        </Button>
      </div>
    </div>
  );
}
