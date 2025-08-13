import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLanguageChange = () => {
    const value = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: value });
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLanguageChange}
      aria-label="Select language"
    >
      <span
        className={cn("text-sm font-medium", locale === "en" && "font-arabic")}
      >
        {locale === "ar" ? "English" : "العربية"}
      </span>
    </Button>
  );
}
