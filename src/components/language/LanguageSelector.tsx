"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = (value: string) => {
    router.replace(pathname, { locale: value });
  };

  return (
    <Select onValueChange={handleLanguageChange} defaultValue={locale}>
      <SelectTrigger className="text-primary h-8 w-[90px] border-none hover:cursor-pointer focus:ring-0 sm:h-10 sm:w-[120px]">
        <SelectValue
          placeholder={<Globe className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
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
