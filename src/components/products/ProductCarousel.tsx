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
      const newScrollPosition = scrollContainerRef.current.scrollLeft;

      // Calculate current index based on scroll position
      if (scrollContainerRef.current.clientWidth > 0) {
        const itemWidth =
          scrollContainerRef.current.scrollWidth / products.length;
        const newIndex = Math.round(newScrollPosition / itemWidth);
        setCurrentIndex(newIndex);
      }
    }
  }, [products.length]);

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
      const itemWidth =
        scrollContainerRef.current.scrollWidth / products.length;
      const newPosition = itemWidth * index;

      scrollContainerRef.current.scrollTo({
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
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.name}
              className="w-full flex-shrink-0 snap-center px-4 md:px-12"
            >
              <div className="mx-auto max-w-md">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced pagination indicators */}
      {products.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
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
