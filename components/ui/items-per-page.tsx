import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
  className?: string;
}

export function ItemsPerPage({
  value,
  onChange,
  options,
  className,
}: ItemsPerPageProps) {
  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Show</span>
        <Select
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
        <span className="text-sm text-gray-500">per page</span>
      </div>
    </div>
  );
}
