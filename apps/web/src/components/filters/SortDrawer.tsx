import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface SortDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  translations: {
    sortBy: string;
    selectSortOrder: string;
    close: string;
  };
  sortTranslations: {
    featured: string;
    priceLow: string;
    priceHigh: string;
    nameAsc: string;
    nameDesc: string;
  };
}

export function SortDrawer({
  isOpen,
  onOpenChange,
  sortOption,
  setSortOption,
  translations,
  sortTranslations,
}: SortDrawerProps) {
  // Helper function to get the display text for the current sort option
  const getSortDisplayText = () => {
    switch (sortOption) {
      case "featured":
        return sortTranslations.featured;
      case "price-low":
        return (
          sortTranslations.priceLow.split(":")[1]?.trim() ||
          sortTranslations.priceLow
        );
      case "price-high":
        return (
          sortTranslations.priceHigh.split(":")[1]?.trim() ||
          sortTranslations.priceHigh
        );
      case "name-asc":
        return (
          sortTranslations.nameAsc.split(":")[1]?.trim() ||
          sortTranslations.nameAsc
        );
      case "name-desc":
        return (
          sortTranslations.nameDesc.split(":")[1]?.trim() ||
          sortTranslations.nameDesc
        );
      default:
        return sortTranslations.featured;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-10 flex-1 items-center justify-center gap-1.5"
          aria-label={`${translations.sortBy}: ${getSortDisplayText()}`}
        >
          <SlidersHorizontal className="mr-1 h-4 w-4" />
          <span className="truncate">{getSortDisplayText()}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{translations.sortBy.replace(":", "")}</DrawerTitle>
          <DrawerDescription>{translations.selectSortOrder}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button
            variant={sortOption === "featured" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setSortOption("featured");
            }}
          >
            {sortTranslations.featured}
          </Button>
          <Button
            variant={sortOption === "price-low" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setSortOption("price-low");
            }}
          >
            {sortTranslations.priceLow}
          </Button>
          <Button
            variant={sortOption === "price-high" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setSortOption("price-high");
            }}
          >
            {sortTranslations.priceHigh}
          </Button>
          <Button
            variant={sortOption === "name-asc" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setSortOption("name-asc");
            }}
          >
            {sortTranslations.nameAsc}
          </Button>
          <Button
            variant={sortOption === "name-desc" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setSortOption("name-desc");
            }}
          >
            {sortTranslations.nameDesc}
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{translations.close}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
