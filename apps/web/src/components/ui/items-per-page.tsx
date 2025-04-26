import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface ItemsPerPageProps {
  defaultValue: number;
  value: number;
  onChange: (value: number) => void;
  options: number[];
  className?: string;
}

export function ItemsPerPage({
  defaultValue,
  value,
  onChange,
  options,
  className,
}: ItemsPerPageProps) {
  const t = useTranslations("pagination");
  const params = useParams();
  const isRTL = params.locale === "ar";

  return (
    <div className={className}>
      <div
        className={`flex items-center ${isRTL ? "flex-row space-x-1 space-x-reverse sm:space-x-2" : "space-x-1 sm:space-x-2"}`}
      >
        <span className="text-xs text-gray-500 sm:text-sm">{t("show")}</span>
        <Select
          defaultValue={defaultValue.toString()}
          value={value.toString()}
          onValueChange={(val) => onChange(Number(val))}
        >
          <SelectTrigger className="h-7 w-[60px] text-xs sm:h-8 sm:w-[70px] sm:text-sm">
            <SelectValue placeholder={value.toString()} />
          </SelectTrigger>
          <SelectContent className="bg-global">
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-gray-500 sm:text-sm">{t("perPage")}</span>
      </div>
    </div>
  );
}
