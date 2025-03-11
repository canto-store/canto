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
      <SelectTrigger className="text-primary h-10 w-[120px] border-none hover:cursor-pointer focus:ring-0">
        <SelectValue placeholder={<Globe className="h-5 w-5" />} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇺🇸 English</SelectItem>
        <SelectItem value="ar" className="font-arabic">
          🇪🇬 العربية
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
