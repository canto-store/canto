import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onSubmit" | "value" | "defaultValue"
  > {
  containerClassName?: string;
  iconClassName?: string;
  onSearch?: (value: string) => void;
  onSubmit?: (value: string) => void;
  debounceMs?: number;
  showButton?: boolean;
  buttonText?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({
  containerClassName,
  iconClassName,
  className,
  onSearch,
  onSubmit,
  debounceMs = 300,
  showButton = true,
  buttonText = "Search",
  value,
  defaultValue,
  placeholder,
  ...props
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(
    value !== undefined ? value : defaultValue?.toString() || "",
  );

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (onSearch) {
        const handler = setTimeout(() => {
          onSearch(value);
        }, debounceMs);

        return () => clearTimeout(handler);
      }
    },
    [onSearch, debounceMs],
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return () => cleanup?.();
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Call onSubmit handler if it exists
      if (onSubmit) {
        onSubmit(searchTerm);
      }
      // If no onSubmit but onSearch exists, call that immediately
      else if (onSearch) {
        onSearch(searchTerm);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(searchTerm);
    } else if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("relative flex gap-2", containerClassName)}
    >
      <div className="relative flex-1">
        <Input
          type="search"
          className={cn("w-full pl-10 placeholder:text-xs", className)}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          {...props}
        />
        <div
          className="absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden="true"
        >
          <Search className={cn("h-4 w-4 text-gray-500", iconClassName)} />
        </div>
      </div>
      {showButton && <Button type="submit">{buttonText}</Button>}
    </form>
  );
}
