"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SliderButton } from "@/components/common";
import { cn } from "@/lib/utils";
import { type HeroSlide } from "@/lib/data/hero-slides";
import { useRouter } from "@/i18n/navigation";
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
  const router = useRouter();
  useEffect(() => {
    if (autoplayInterval <= 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [slides.length, autoplayInterval]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className={cn(
        "relative right-[50%] left-[50%] -mx-[50vw] h-[calc(100vh-4rem)] w-screen max-w-none overflow-hidden",
        className,
      )}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            currentSlide === index ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative flex h-full items-center justify-center px-4 text-center text-white sm:px-6 md:px-8 lg:px-16">
            <div className="max-w-4xl">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-5xl lg:text-7xl">
                {slide.title}
              </h2>
              <p className="mb-6 text-sm sm:text-base md:text-xl lg:text-2xl">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                variant="default"
                asChild
                className="text-sm sm:text-base"
                onClick={() => router.push("/browse")}
              >
                <span>Shop Now</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <SliderButton
        direction="left"
        onClick={handlePrevSlide}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 sm:left-4 md:left-6 lg:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </SliderButton>
      <SliderButton
        direction="right"
        onClick={handleNextSlide}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 sm:right-4 md:right-6 lg:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </SliderButton>
    </section>
  );
}
