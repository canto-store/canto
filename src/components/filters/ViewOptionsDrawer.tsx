import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
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

interface ViewOptionsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  translations: {
    viewOptions: string;
    selectViewMode: string;
    grid: string;
    list: string;
    close: string;
  };
}

export function ViewOptionsDrawer({
  isOpen,
  onOpenChange,
  activeTab,
  setActiveTab,
  translations,
}: ViewOptionsDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-10 flex-1 items-center justify-center gap-1.5"
        >
          {activeTab === "grid" ? (
            <LayoutGrid className="mr-1 h-4 w-4" />
          ) : (
            <List className="mr-1 h-4 w-4" />
          )}
          {translations.viewOptions}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{translations.viewOptions}</DrawerTitle>
          <DrawerDescription>{translations.selectViewMode}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 px-4">
          <Button
            variant={activeTab === "grid" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setActiveTab("grid");
            }}
          >
            <LayoutGrid className="h-5 w-5" />
            {translations.grid}
          </Button>
          <Button
            variant={activeTab === "list" ? "default" : "outline"}
            className="flex w-full items-center justify-start gap-2"
            onClick={() => {
              setActiveTab("list");
            }}
          >
            <List className="h-5 w-5" />
            {translations.list}
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
