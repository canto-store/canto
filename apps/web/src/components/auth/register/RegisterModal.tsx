"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { RegisterSuccess } from "./RegisterSuccess";

export function RegisterModal({
  isOpen,
  onClose,
  switchToLogin,
}: {
  isOpen: boolean;
  onClose: () => void;
  switchToLogin: () => void;
}) {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [isSuccess, setSuccess] = useState(false);

  const onSuccess = (email: string) => {
    setEmail(email);
    setSuccess(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-global sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("registerTitle")}</DialogTitle>
        </DialogHeader>
        {isSuccess ? (
          <RegisterSuccess
            email={email}
            switchToLogin={switchToLogin}
            onClose={onClose}
          />
        ) : (
          <RegisterForm switchToLogin={switchToLogin} onSuccess={onSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
