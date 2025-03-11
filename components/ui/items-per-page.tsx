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
        className={`flex items-center ${isRTL ? "space-x-2 space-x-reverse" : "space-x-2"}`}
      >
        <span className="text-sm text-gray-500">{t("show")}</span>
        <Select
          defaultValue={defaultValue.toString()}
          value={value.toString()}
          onValueChange={(val) => onChange(Number(val))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={value.toString()} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500">{t("perPage")}</span>
      </div>
    </div>
  );
}
