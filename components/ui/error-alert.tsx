"use client";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorAlertProps {
  message: string | null;
  className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className={cn(
        "border-destructive/50 bg-destructive/10 text-destructive text-sm",
        "dark:border-destructive/30 dark:bg-destructive/20",
        "flex items-center gap-3",
        "bg-orange-red/80 border-1 border-red-500",
        className,
      )}
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
