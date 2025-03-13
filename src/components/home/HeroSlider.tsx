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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { showBanner } = useBanner();
  const router = useRouter();
  const t = useTranslations("heroSlider");

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Don't auto-scroll if autoplayInterval is disabled or on mobile devices
    if (autoplayInterval <= 0 || isMobile) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [slides.length, autoplayInterval, isMobile]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

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

  return (
    <section
      ref={sliderRef}
      className={cn(
        "relative right-[50%] left-[50%] -mx-[50vw] h-[calc(100vh-4rem)] w-screen max-w-none overflow-hidden",
        className,
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="h-main relative w-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const { title, subtitle } = getTranslatedContent(slide);
            return (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <div
                  className="absolute inset-0 h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
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
          "absolute right-0 left-0 flex justify-center gap-2",
          showBanner ? "bottom-16" : "bottom-8",
        )}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === index
                ? "w-6 bg-white"
                : "bg-white/50 hover:bg-white/70",
            )}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - hidden on mobile */}
      <SliderButton
        direction="left"
        onClick={handlePrevSlide}
        className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 sm:left-4 sm:flex md:left-6 lg:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </SliderButton>
      <SliderButton
        direction="right"
        onClick={handleNextSlide}
        className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 sm:right-4 sm:flex md:right-6 lg:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </SliderButton>
    </section>
  );
}
