"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SliderButton } from "@/components/common";
import { cn } from "@/lib/utils";
import { type HeroSlide } from "@/lib/data/hero-slides";
import { useGesture } from "@use-gesture/react";
import type { DragState } from "@use-gesture/react";

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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (autoplayInterval <= 0 || isDragging) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => {
      clearInterval(timer);
    };
  }, [slides.length, autoplayInterval, isDragging]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const bind = useGesture(
    {
      onDrag: (state: DragState) => {
        const [mx] = state.movement;
        const [xDir] = state.direction;
        setIsDragging(state.active);
        if (!state.active) {
          if (Math.abs(mx) > 50) {
            if (xDir < 0) {
              handleNextSlide();
            } else {
              handlePrevSlide();
            }
          }
        }
      },
    },
    {
      drag: {
        bounds: { left: -100, right: 100 },
        rubberband: true,
      },
    },
  );

  return (
    <section
      className={cn("relative h-[calc(100vh-4rem)] min-h-[600px]", className)}
      {...bind()}
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
          <div className="relative flex h-full items-center justify-center px-16 text-center text-white sm:px-20">
            <div className="max-w-3xl px-4">
              <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-5xl lg:text-7xl">
                {slide.title}
              </h2>
              <p className="mb-6 text-sm sm:text-base md:text-xl lg:text-2xl">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-sm sm:text-base"
              >
                <a href="/browse">Shop Now</a>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <SliderButton
        icon={ChevronLeft}
        onClick={handlePrevSlide}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 sm:left-4"
        ariaLabel="Previous slide"
      />
      <SliderButton
        icon={ChevronRight}
        onClick={handleNextSlide}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 sm:right-4"
        ariaLabel="Next slide"
      />
    </section>
  );
}
