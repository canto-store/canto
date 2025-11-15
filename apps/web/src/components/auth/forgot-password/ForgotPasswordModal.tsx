"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function ForgotPasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-global gap-6 p-8 shadow-lg sm:max-w-[400px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {isSuccess ? "Password Reset Email Sent!" : "Reset Your Password"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground flex flex-col items-center justify-center gap-3">
            {isSuccess && (
              <div className="w-fit items-center justify-center rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            )}
            {isSuccess
              ? "Please check your email for the password reset link."
              : "Please enter your email address to receive a link to reset your password."}
          </DialogDescription>
        </DialogHeader>
        {!isSuccess && <ForgotPasswordForm setIsSuccess={setIsSuccess} />}
      </DialogContent>
    </Dialog>
  );
}
