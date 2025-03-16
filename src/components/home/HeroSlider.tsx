"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SliderButton } from "@/components/common";
import { cn } from "@/lib/utils";
import { type HeroSlide } from "@/lib/data/hero-slides";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useBanner } from "@/providers";
import { useLocale } from "next-intl";
import Image from "next/image";

// Create a safe useLayoutEffect that falls back to useEffect in SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useEffect : useEffect;

interface HeroSliderProps {
  slides: HeroSlide[];
  autoplayInterval?: number;
  className?: string;
}

export function HeroSlider({
  slides,
  autoplayInterval = 5000,
  className,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at index 1 (first real slide)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { showBanner } = useBanner();
  const router = useRouter();
  const t = useTranslations("heroSlider");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Create an augmented array with cloned slides for infinite effect
  // Add last slide at the beginning and first slide at the end
  const augmentedSlides = useCallback(() => {
    if (slides.length === 0) return [];
    return [
      slides[slides.length - 1], // Clone of last slide at the beginning
      ...slides,
      slides[0], // Clone of first slide at the end
    ];
  }, [slides]);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    // If we're at the cloned last slide (position 0), jump to the real last slide
    if (currentSlide === 0) {
      setCurrentSlide(slides.length);
    }
    // If we're at the cloned first slide (position slides.length+1), jump to the real first slide
    else if (currentSlide === slides.length + 1) {
      setCurrentSlide(1);
    }
  }, [currentSlide, slides.length]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  }, [isTransitioning]);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  }, [isTransitioning]);

  // Use useIsomorphicLayoutEffect to ensure height calculation happens before paint
  useIsomorphicLayoutEffect(() => {
    const calculateHeight = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };

    // Calculate on initial load
    calculateHeight();

    // Add event listener for window resize
    window.addEventListener("resize", calculateHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, [showBanner]);

  useEffect(() => {
    // Don't auto-scroll if autoplayInterval is disabled or on mobile devices
    if (autoplayInterval <= 0 || isMobile) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, autoplayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [autoplayInterval, isMobile, handleNextSlide]);

  // Handle the transition end to reset position for infinite loop

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    // Invert swipe direction for RTL
    const swipeDistance = isRTL ? -distance : distance;
    const isLeftSwipe = swipeDistance > minSwipeDistance;
    const isRightSwipe = swipeDistance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Function to get translated title and subtitle based on translationKey
  const getTranslatedContent = (slide: HeroSlide) => {
    if (!slide.translationKey)
      return { title: slide.title, subtitle: slide.subtitle };

    return {
      title: t(`${slide.translationKey}Collection`, {
        defaultValue: slide.title,
      }),
      subtitle: t(`${slide.translationKey}Subtitle`, {
        defaultValue: slide.subtitle,
      }),
    };
  };

  // Get the actual slides with clones
  const displaySlides = augmentedSlides();

  // Calculate the real index for pagination indicators
  const realIndex =
    currentSlide === 0
      ? slides.length - 1
      : currentSlide === slides.length + 1
        ? 0
        : currentSlide - 1;

  return (
    <section
      ref={sliderRef}
      className={cn(
        "relative right-[50%] left-[50%] -mx-[50vw] w-screen max-w-none overflow-hidden",
        // Mobile height (default)
        showBanner
          ? "h-[calc(100vh-var(--total-top-height)-var(--footer-height))]"
          : "h-[calc(100vh-var(--header-height)-var(--footer-height))]",
        // Desktop optimized height
        "md:h-screen",
        "min-h-[400px] transition-all duration-300 ease-in-out", // Match banner transition
        className,
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: isRTL
              ? `translateX(${currentSlide * 100}%)`
              : `translateX(-${currentSlide * 100}%)`,
            transition: isTransitioning
              ? "transform 500ms ease-in-out"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displaySlides.map((slide, index) => {
            const { title, subtitle } = getTranslatedContent(slide);
            return (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    src={slide.image}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index <= 1} // Prioritize first two slides (clone and first real slide)
                    quality={80}
                    loading={index <= 1 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative flex h-full items-center justify-center px-4 text-center text-white sm:px-6 md:px-8 lg:px-16">
                  <div className="max-w-4xl">
                    <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-5xl lg:text-7xl">
                      {title}
                    </h2>
                    <p className="mb-6 text-sm sm:text-base md:text-xl lg:text-2xl">
                      {subtitle}
                    </p>
                    <Button
                      size="lg"
                      variant="default"
                      asChild
                      className="text-sm sm:text-base"
                      onClick={() => router.push("/browse")}
                    >
                      <span>{t("shopNow", { defaultValue: "Shop Now" })}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination indicators */}
      <div
        className={cn(
          "absolute right-0 bottom-4 left-0 flex justify-center gap-2",
        )}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              realIndex === index
                ? "w-6 bg-white"
                : "bg-white/50 hover:bg-white/70",
            )}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentSlide(index + 1);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - hidden on mobile */}
      <SliderButton
        direction={isRTL ? "right" : "left"}
        onClick={handlePrevSlide}
        className={cn(
          "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:flex",
          isRTL
            ? "right-2 sm:right-4 md:right-6 lg:right-8"
            : "left-2 sm:left-4 md:left-6 lg:left-8",
        )}
      >
        {isRTL ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </SliderButton>
      <SliderButton
        direction={isRTL ? "left" : "right"}
        onClick={handleNextSlide}
        className={cn(
          "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:flex",
          isRTL
            ? "left-2 sm:left-4 md:left-6 lg:left-8"
            : "right-2 sm:right-4 md:right-6 lg:right-8",
        )}
      >
        {isRTL ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </SliderButton>
    </section>
  );
}
