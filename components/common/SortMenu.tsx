import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <Select
        value={value}
        onValueChange={(value) => onValueChange(value as SortOption)}
      >
        <SelectTrigger className={width}>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Featured</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="name-asc">Name: A to Z</SelectItem>
          <SelectItem value="name-desc">Name: Z to A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
