"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  // Render the language text directly based on the current locale
  const renderLanguageText = () => {
    if (locale === "ar") {
      return (
        <>
          🇪🇬 <span className="hidden sm:inline">العربية</span>
          <span className="sm:hidden">AR</span>
        </>
      );
    }
    return (
      <>
        🇺🇸 <span className="hidden sm:inline">English</span>
        <span className="sm:hidden">EN</span>
      </>
    );
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={locale}>
      <SelectTrigger
        className={cn(
          "text-primary h-8 w-[90px] border-none hover:cursor-pointer focus:ring-0 sm:h-10 sm:w-[120px]",
          className,
        )}
        aria-label="Select language"
      >
        {/* Show the language text directly instead of relying on SelectValue */}
        {mounted ? (
          <SelectValue />
        ) : (
          <div className="flex items-center">{renderLanguageText()}</div>
        )}
      </SelectTrigger>
      <SelectContent className="bg-global">
        <SelectItem value="en">
          🇺🇸 <span className="hidden sm:inline">English</span>
          <span className="sm:hidden">EN</span>
        </SelectItem>
        <SelectItem value="ar" className="font-arabic">
          🇪🇬 <span className="hidden sm:inline">العربية</span>
          <span className="sm:hidden">AR</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
