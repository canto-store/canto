"use client";

import * as React from "react";
import { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
  customErrorMessage?: string;
}

export function FormInput({
  id,
  label,
  className,
  error,
  required = false,
  showRequiredIndicator = true,
  customErrorMessage,
  onBlur,
  ...props
}: FormInputProps) {
  const t = useTranslations();
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);
  const generatedId = useId();
  const inputId = id || generatedId;

  // Update local error when prop changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);

    // Validate on blur if required
    if (required && !e.target.value.trim()) {
      setLocalError(customErrorMessage || t("form.fieldRequired"));
    } else {
      setLocalError(undefined);
    }

    // Call the original onBlur if provided
    if (onBlur) {
      onBlur(e);
    }
  };

  const showError = touched && localError;

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={inputId}
          className="flex items-center gap-1 text-sm font-medium"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500">*</span>
          )}
        </Label>
      )}
      <Input
        id={inputId}
        className={cn(
          showError && "border-red-500 focus-visible:ring-red-500",
          className,
        )}
        aria-invalid={!!showError}
        aria-required={required}
        required={required}
        onBlur={handleBlur}
        {...props}
      />
      {showError && <p className="mt-1 text-sm text-red-500">{localError}</p>}
    </div>
  );
}
