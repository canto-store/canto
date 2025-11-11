import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import api from "@/lib/api";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.onfocus = () => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      };
    }
  }, []);

  const router = useRouter();
  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSearchTerm(value);
    }
  }, [value]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.get<string[]>(
        `/product/autocomplete?query=${encodeURIComponent(query)}`,
      );
      setSuggestions(response.data);
      setShowSuggestions(response.data.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (input: string) => {
      if (value === input) return;
      const handler = setTimeout(() => {
        fetchSuggestions(input);
        if (onSearch) {
          onSearch(input);
        }
      }, debounceMs);

      return () => clearTimeout(handler);
    },
    [onSearch, fetchSuggestions, debounceMs],
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return () => cleanup?.();
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        setSelectedIndex(-1);
    }
  };

  const handleSubmit = () => {
    setShowSuggestions(false);
    if (onSubmit) {
      onSubmit(searchTerm);
    }
    if (onSearch) {
      onSearch(searchTerm);
    }
    router.push(`/browse?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSubmit) {
      onSubmit(suggestion);
    }
    if (onSearch) {
      onSearch(suggestion);
    }
    router.push(`/browse?q=${encodeURIComponent(suggestion)}`);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSuggestions]);

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("relative flex gap-4", containerClassName)}
    >
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          name="search"
          type="search"
          className={cn("w-full pl-10 placeholder:text-xs", className)}
          value={searchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          {...props}
        />
        <div
          className="absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden="true"
        >
          <Search className={cn("h-4 w-4 text-gray-500", iconClassName)} />
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading suggestions...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                    selectedIndex === index && "bg-gray-100",
                  )}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                No suggestions found
              </div>
            )}
          </div>
        )}
      </div>
      {showButton && (
        <Button className="h-10" type="submit">
          {buttonText}
        </Button>
      )}
    </form>
  );
}
