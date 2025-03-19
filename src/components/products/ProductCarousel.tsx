"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Update scroll position state when scrolling
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const scrollPosition = scrollContainer.scrollLeft;

      // Calculate current index based on scroll position, accounting for RTL
      if (scrollContainer.clientWidth > 0) {
        const itemWidth = scrollContainer.scrollWidth / products.length;

        // In RTL mode, scrollLeft is negative in most browsers
        // We need to use the absolute value and adjust the calculation
        const normalizedScrollPosition = isRTL
          ? Math.abs(scrollPosition)
          : scrollPosition;

        const newIndex = Math.round(normalizedScrollPosition / itemWidth);
        setCurrentIndex(newIndex);
      }
    }
  }, [products.length, isRTL]);

  // Attach scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current && products.length > 0) {
      const scrollContainer = scrollContainerRef.current;
      const itemWidth = scrollContainer.scrollWidth / products.length;

      let newPosition = itemWidth * index;

      if (isRTL) {
        newPosition = scrollContainer.scrollWidth - itemWidth * (index + 1);
      }

      scrollContainer.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative">
      {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth pt-1 pb-6"
        >
          {products.map((product, index) => (
            <div
              key={product.name}
              className="w-full flex-shrink-0 snap-center px-4 md:px-12"
            >
              <div className="mx-auto max-w-md">
                <ProductCard
                  product={product}
                  priority={index === 0}
                  index={index}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length > 1 && (
        <div className="flex justify-center gap-3">
          {products.map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-3 rounded-full transition-all",
                currentIndex === i
                  ? "bg-primary w-8"
                  : "w-3 bg-gray-300 hover:bg-gray-400",
              )}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
