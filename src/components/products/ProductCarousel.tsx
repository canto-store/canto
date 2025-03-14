import { useState, useRef, useEffect, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const isRTL = params.locale === "ar";

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
          ? scrollContainer.scrollWidth -
            scrollContainer.clientWidth +
            scrollPosition
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

      // Calculate the position based on RTL or LTR
      let newPosition = itemWidth * index;

      // For RTL, we need to adjust the scroll position
      if (isRTL) {
        // In RTL, we need to scroll from the right side
        newPosition = itemWidth * (products.length - index - 1);
      }

      scrollContainer.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {title && <h3 className="mb-4 text-xl font-semibold">{title}</h3>}

      <div className="relative">
        {/* Carousel container */}
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth pt-1 pb-6"
          style={{
            scrollbarWidth: "none",
            // Force the scroll direction for RTL
            direction: isRTL ? "rtl" : "ltr",
          }}
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

      {/* Enhanced pagination indicators */}
      {products.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          {/* For RTL, we can keep the same order of indicators but adjust the scrollToIndex function */}
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
