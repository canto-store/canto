import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "name-desc";

export interface SortMenuProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
  className?: string;
  label?: string;
  width?: string;
}

export function SortMenu({
  value,
  onValueChange,
  className = "",
  label = "Sort by:",
  width = "w-[180px]",
}: SortMenuProps) {
  const t = useTranslations();
  const params = useParams();
  const isRTL = params.locale === "ar";

  return (
    <div
      className={`flex items-center ${isRTL ? "flex-row-reverse gap-1 sm:gap-2" : "gap-1 sm:gap-2"} ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      {label && (
        <span className="text-xs font-medium text-gray-700 sm:text-sm">
          {label}
        </span>
      )}
      <Select
        value={value}
        onValueChange={(value) => onValueChange(value as SortOption)}
      >
        <SelectTrigger className={`text-xs sm:text-sm ${width}`}>
          <SelectValue placeholder={t("products.sortBy")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">{t("sort.featured")}</SelectItem>
          <SelectItem value="price-low">{t("sort.priceLow")}</SelectItem>
          <SelectItem value="price-high">{t("sort.priceHigh")}</SelectItem>
          <SelectItem value="name-asc">{t("sort.nameAsc")}</SelectItem>
          <SelectItem value="name-desc">{t("sort.nameDesc")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
