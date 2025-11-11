"use client";

import { useRef, useState, useEffect } from "react";
import { ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useGetCart } from "@/lib/cart";
import { CartItemComponent } from "../cart/CartItem";
import { cn, formatPrice } from "@/lib/utils";
import { useAllCategories } from "@/lib/categories";
import { HomeCategoriesSkeleton } from "../home/HomeCategoriesSkeleton";
import { CategoryCard } from "./CategoryCard";

interface ShopDropdownProps {
  className?: string;
}

export function ShopDropdown({ className }: ShopDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data } = useGetCart();
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { data: categories, isLoading } = useAllCategories();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle hover state with delay for better UX
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isHovering) {
      setIsOpen(true);
    } else {
      // Add a small delay before closing to prevent accidental closures
      timeoutId = setTimeout(() => {
        if (!isHovering) {
          setIsOpen(false);
        }
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push("/cart");
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  // Get the appropriate chevron icon based on language direction
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  // if (isLoading || !categories) {
  //   return <HomeCategoriesSkeleton />;
  // }

  const rectangleCategories = categories?.filter(
    (category) => category.aspect === "RECTANGLE",
  );
  const squareCategories = categories?.filter(
    (category) => category.aspect === "SQUARE",
  );

  if (!data) return null;
  return (
    <div
      className={cn("relative isolate", className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="text-primary relative flex h-10 w-10 items-center justify-center rounded-full p-2 transition-colors"
        aria-label={t("header.cart")}
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="text-primary hovers:bg-primary/10 text-base font-medium transition-colors">
          {t("header.browse")}
        </span>
        {data.count > 0 && (
          <span
            className={cn(
              "bg-primary absolute flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white",
              isRTL ? "-top-1 -left-1" : "-top-1 -right-1",
            )}
          >
            {data.count}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "bg-global absolute z-50 mt-2 rounded-md p-4 shadow-lg",
            // "w-[calc(100vw-32px)] max-w-[320px] sm:w-80",
            "w-[calc(100vw-32px)] max-w-4xl sm:max-w-2xl",
            "left-1/2 origin-top -translate-x-1/2 transform",
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {rectangleCategories?.slice(0, 2).map((category) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  variant="rectangle"
                />
              ))}
            </div>

            <div className="grid grid-cols-6 gap-4">
              {squareCategories?.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {rectangleCategories?.slice(2).map((category) => (
                <CategoryCard
                  key={category.name}
                  category={category}
                  variant="rectangle"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
