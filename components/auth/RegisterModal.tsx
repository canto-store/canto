"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RegisterForm } from "./RegisterForm";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const t = useTranslations("auth");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-global gap-6 p-8 shadow-lg sm:max-w-[400px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {t("registerTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("registerSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <RegisterForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
