import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import React, { forwardRef } from "react";
import { HomeCategoriesBanner } from "./HomeCategoriesBanner";
import { useTranslations } from "next-intl";

type ShopPopoverProps = Record<string, unknown>;

const ShopPopover = forwardRef<HTMLDivElement, ShopPopoverProps>(
  (_props, ref) => {
    const t = useTranslations("header");

    return (
      <Popover placement="bottom" backdrop="blur">
        <PopoverTrigger>
          <div
            ref={ref}
            className={`group navigation-label flex cursor-pointer items-center justify-center gap-2 p-2`}
          >
            <div className="text-primary hovers:bg-primary/10 text-base font-medium transition-colors">
              {t("browse")}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[96%] justify-start overflow-auto lg:h-fit lg:w-full lg:justify-center">
          <HomeCategoriesBanner />
        </PopoverContent>
      </Popover>
    );
  },
);

ShopPopover.displayName = "ShopPopover";
export default ShopPopover;
