"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/providers/auth/auth-provider";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function AuthenticationHandler() {
  const { user } = useAuth();
  const t = useTranslations("auth");
  const router = useRouter();
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // Effect for countdown and auto-redirect if logged in
  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, router]);

  if (!user) {
    // Not logged in - show the login form
    return <LoginForm onRegister={() => router.push("/sign-up")} />;
  }

  // Already logged in - show success message
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <div className="flex flex-col items-center space-y-4">
        <CheckCircle className="text-primary h-16 w-16" />
        <h2 className="text-xl font-semibold">{t("alreadyLoggedIn")}</h2>
        <p className="text-muted-foreground">
          {t("welcomeBack", { name: user.name })}
        </p>
        <p className="text-muted-foreground text-sm">
          {t("redirectingIn", { seconds: redirectCountdown })}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/")} variant="default">
          {t("goToHome")}
        </Button>
        <Button onClick={() => router.push("/profile")} variant="outline">
          {t("viewProfile")}
        </Button>
      </div>
    </div>
  );
}
