import { Button } from "@/components/ui/button";
import { ItemsPerPage } from "@/components/ui/items-per-page";
import { SortMenu, type SortOption } from "@/components/common/SortMenu";
import { LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";

interface ResultsControlsProps {
  filteredProductsCount: number;
  currentPage: number;
  itemsPerPage: number;
  isRTL: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  onItemsPerPageChange: (value: number) => void;
  formatNumber: (num: number) => string;
}

export function ResultsControls({
  filteredProductsCount,
  currentPage,
  itemsPerPage,
  isRTL,
  activeTab,
  setActiveTab,
  sortOption,
  setSortOption,
  onItemsPerPageChange,
  formatNumber,
}: ResultsControlsProps) {
  const productsT = useTranslations("products");

  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Mobile View: Products Count and Items Per Page on same line */}
      <div className="flex w-full items-center justify-between sm:hidden">
        <p className="text-sm text-gray-600" dir={isRTL ? "rtl" : "ltr"}>
          {productsT("productsCount", { count: filteredProductsCount })}
          {filteredProductsCount > 0 && (
            <span
              className={`${isRTL ? "mr-1" : "ml-1"} text-xs text-gray-500`}
            >
              ({formatNumber(filteredProductsCount)})
            </span>
          )}
        </p>

        <ItemsPerPage
          defaultValue={itemsPerPage}
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          options={[5, 10, 15, 20]}
        />
      </div>

      {/* Desktop View: Products Count */}
      <p
        className="hidden text-sm text-gray-600 sm:block sm:text-base"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {productsT("productsCount", { count: filteredProductsCount })}
        {filteredProductsCount > 0 && (
          <span
            className={`${isRTL ? "mr-1" : "ml-1"} text-xs text-gray-500 sm:text-sm`}
          >
            (
            {formatNumber(
              Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredProductsCount,
              ),
            )}{" "}
            -{" "}
            {formatNumber(
              Math.min(currentPage * itemsPerPage, filteredProductsCount),
            )}{" "}
            / {formatNumber(filteredProductsCount)})
          </span>
        )}
      </p>

      {/* Desktop View Controls */}
      <div className="hidden items-center justify-end gap-3 sm:flex">
        <div className="flex items-center gap-3">
          {/* Desktop View mode buttons */}
          <div className="h-9 w-[160px] overflow-hidden rounded-md border">
            <Button
              variant={activeTab === "grid" ? "default" : "ghost"}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab("grid")}
            >
              <LayoutGrid className="mr-1 h-4 w-4" />
              {productsT("grid")}
            </Button>
            <Button
              variant={activeTab === "list" ? "default" : "ghost"}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab("list")}
            >
              <List className="mr-1 h-4 w-4" />
              {productsT("list")}
            </Button>
          </div>

          <SortMenu
            value={sortOption as SortOption}
            onValueChange={setSortOption}
            label={productsT("sortBy")}
            width="w-[180px]"
          />
        </div>

        <ItemsPerPage
          defaultValue={itemsPerPage}
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          options={[5, 10, 15, 20]}
        />
      </div>
    </div>
  );
}
