"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignUpForm } from "./SignUpForm";
import { useTranslations } from "next-intl";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const t = useTranslations("auth");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("signUpTitle")}</DialogTitle>
        </DialogHeader>
        <SignUpForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
