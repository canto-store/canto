import { type Category } from "@/types/category";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useState } from "react";

interface CategoryCardProps {
  category: Category;
  variant?: "square" | "rectangle";
  type?: "category" | "banner";
}

export function CategoryCard({
  category,
  variant = "square",
  type = "category",
}: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubcategories = category.children && category.children.length > 0;

  const cardContent = (
    <div
      className={cn(
        "relative shadow-lg transition-transform duration-300",
        !category.coming_soon &&
          "hover:scale-102 hover:cursor-pointer hover:shadow-xl",
        variant === "rectangle" ? "aspect-video" : "aspect-square",
        type === "banner" ? "h-[60px] lg:h-[100px]" : "",
      )}
    >
      {category.coming_soon && (
        <span
          className={cn(
            "absolute z-10 rounded-full bg-black/70 font-semibold tracking-wide text-white uppercase shadow-sm backdrop-blur-sm",
            type === "banner"
              ? "top-0 right-0 px-2 py-1 text-[10px]"
              : "top-0 right-0 px-2 py-1 text-[10px] lg:top-5 lg:right-5 lg:px-3 lg:py-2 lg:text-xs",
          )}
        >
          Coming Soon
        </span>
      )}
      <Image
        src={category.image || "/placeholder-image.jpg"}
        alt={category.name}
        className="object-fit h-full w-full rounded-lg"
        width={variant === "rectangle" ? 400 : 300}
        height={variant === "rectangle" ? 225 : 300}
        priority={true}
        loading="eager"
        quality={80}
      />
    </div>
  );

  // If category has subcategories and is not coming soon, use dropdown
  if (hasSubcategories && !category.coming_soon) {
    const dropdownItems = [
      {
        key: category.slug,
        label: `All ${category.name}`,
        href: `/shop?category=${category.slug}`,
        comingSoon: false,
      },
      ...category.children!.map((subcategory) => ({
        key: subcategory.slug,
        label: subcategory.name,
        href: `/shop?subCategory=${subcategory.slug}`,
        comingSoon: subcategory.coming_soon || false,
      })),
    ];

    return (
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger>
          <div>{cardContent}</div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={`${category.name} subcategories`}
          items={dropdownItems}
        >
          {(item) => (
            <DropdownItem
              key={item.key}
              href={item.comingSoon ? undefined : item.href}
              className={
                item.key === category.slug
                  ? "font-semibold"
                  : item.comingSoon
                    ? "opacity-50"
                    : ""
              }
              isDisabled={item.comingSoon}
            >
              {item.label}
              {item.comingSoon && (
                <span className="ml-2 text-[8px] text-gray-500">
                  (Coming Soon)
                </span>
              )}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }

  // Otherwise, render as a simple link
  return (
    <a
      href={
        category.coming_soon ? undefined : `/shop?category=${category.slug}`
      }
      key={category.name}
      onClick={(e) => {
        if (category.coming_soon) {
          e.preventDefault();
        }
      }}
    >
      {cardContent}
    </a>
  );
}
