"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "./LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => void;
}

export function LoginModal({ isOpen, onClose, onRegister }: LoginModalProps) {
  const t = useTranslations("auth");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-global gap-6 p-8 shadow-lg sm:max-w-[400px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {t("loginTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("loginSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={onClose} onRegister={onRegister} />
      </DialogContent>
    </Dialog>
  );
}
