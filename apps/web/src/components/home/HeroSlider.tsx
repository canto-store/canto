"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SliderButton } from "@/components/common";
import { cn } from "@/lib/utils";
import { useBanner } from "@/providers";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HERO_SLIDES as slides } from "@/lib/data/hero-slides";
export function HeroSlider() {
  const autoplayInterval = 5000;
  const [currentSlide, setCurrentSlide] = useState(1); // Start at index 1 (first real slide)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { showBanner } = useBanner();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const isMobile = useMediaQuery("(max-width: 767px)", false);

  const augmentedSlides = useCallback(() => {
    if (slides.length === 0) return [];
    return [
      slides[slides.length - 1], // Clone of last slide at the beginning
      ...slides,
      slides[0], // Clone of first slide at the end
    ];
  }, []);

  const minSwipeDistance = 50;

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    if (currentSlide === 0) {
      setCurrentSlide(slides.length);
    } else if (currentSlide === slides.length + 1) {
      setCurrentSlide(1);
    }
  }, [currentSlide]);

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

  useEffect(() => {
    if (autoplayInterval <= 0 || isMobile) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, autoplayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [autoplayInterval, isMobile, handleNextSlide]);

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

  const displaySlides = augmentedSlides();

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
        "relative right-[50%] left-[50%] -mx-[50vw] h-screen w-screen max-w-none overflow-hidden transition-all duration-300 ease-in-out",
        showBanner
          ? "h-[calc(100vh-6.5rem-5rem)] md:h-[calc(100vh-6.5rem)]"
          : "h-[calc(100vh-4.5rem-5rem)] md:h-[calc(100vh-4.5rem)]",
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
            return (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <div className="absolute inset-0 h-full w-full">
                  <Image
                    src={slide.image}
                    alt="Hero Slider"
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority={index <= 1} // Prioritize first two slides (clone and first real slide)
                    quality={80}
                    loading={index <= 1 ? "eager" : "lazy"}
                  />
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
