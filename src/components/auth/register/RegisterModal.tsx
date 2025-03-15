"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";
import { useTranslations } from "next-intl";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-global sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("registerTitle")}</DialogTitle>
        </DialogHeader>
        <RegisterForm switchToLogin={switchToLogin} />
      </DialogContent>
    </Dialog>
  );
}
