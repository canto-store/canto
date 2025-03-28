import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Filter, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-haiku";
import { cn } from "@/lib/utils";
interface SearchFilterBarProps {
  searchQuery: string;
  onSearch: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearch,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  clearFilters,
}: SearchFilterBarProps) {
  const t = useTranslations();
  const productsT = useTranslations("products");
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  return (
    <div className="mb-3 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1">
        <SearchBar
          placeholder={t("header.placeholder")}
          value={searchQuery}
          onSubmit={onSearch}
          className={cn(
            "border-light-gray w-full border-2",
            isMobile && "rounded-full",
          )}
          buttonText={t("header.search")}
          showButton={!isMobile}
        />
      </div>

      <div className="flex items-center gap-2 self-start">
        {/* Desktop Filter Button */}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          className="hidden h-10 items-center gap-1.5 sm:flex"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <X className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
          {showFilters ? productsT("clearFilters") : productsT("filters")}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden h-10 text-xs sm:flex sm:text-sm"
            onClick={clearFilters}
          >
            {productsT("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
