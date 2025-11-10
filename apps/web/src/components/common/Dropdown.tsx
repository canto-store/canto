"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useGetCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { useAllCategories } from "@/lib/categories";

interface DropdownProps {
  className?: string;
  content: ReactNode;
  dropdown: ReactNode;
}

export function Dropdown({ className, content, dropdown }: DropdownProps) {
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

  if (!data) return null;
  return (
    <div
      className={cn("relative isolate", className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}
      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "bg-global absolute z-50 mt-2 rounded-md p-4 shadow-lg",
            "w-[calc(100vw-32px)] max-w-4xl sm:max-w-2xl",
            "left-1/2 origin-top -translate-x-1/2 transform",
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {dropdown}
        </div>
      )}
    </div>
  );
}
