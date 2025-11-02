import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LocaleWrapperProps {
  children: ReactNode;
  locale: string;
}

export function LocaleWrapper({ children, locale }: LocaleWrapperProps) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  const localeClass = locale === "ar" ? "font-arabic" : "font-latin";

  return (
    <div className={cn("min-h-screen", localeClass)} dir={dir} lang={locale}>
      {children}
    </div>
  );
}
