"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { type Product } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";

const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in luxury fashion",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Exclusive Brands",
    subtitle: "Shop designer collections",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "New Arrivals",
    subtitle: "Be the first to shop new styles",
  },
];

const CATEGORIES = [
  {
    name: "Streetwear",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Denim",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Basics",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Luxury",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&q=80&w=600&h=600",
  },
];

const FEATURED_PRODUCTS: Product[] = [
  {
    name: "Oversized Cotton Hoodie",
    brand: "ESSENTIALS",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Classic Denim Jacket",
    brand: "VINTAGE",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Minimalist Watch",
    brand: "TIMELESS",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Premium Leather Sneakers",
    brand: "LUXE STEPS",
    price: 259.99,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600&h=600",
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleQuickAdd = (productName: string) => {
    setCartCount((prev) => prev + 1);
    toast(`${productName} has been added to your cart.`, {
      description: "You can view your cart anytime.",
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header cartCount={cartCount} />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[calc(100vh-4rem)] min-h-[600px]">
          {HERO_SLIDES.map((slide, index) => (
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
              <div className="relative flex h-full items-center justify-center px-4 text-center text-white">
                <div>
                  <h2 className="mb-4 text-5xl font-bold md:text-7xl">
                    {slide.title}
                  </h2>
                  <p className="mb-8 text-xl md:text-2xl">{slide.subtitle}</p>
                  <Button size="lg" variant="secondary">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/30"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </section>

        {/* Categories */}
        <section className="bg-background px-4 py-16">
          <div className="container mx-auto">
            <h2 className="text-foreground mb-8 text-3xl font-bold">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {CATEGORIES.map((category) => (
                <div
                  key={category.name}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-white">
                      {category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <ProductGrid
          products={FEATURED_PRODUCTS}
          onAddToCart={handleQuickAdd}
          title="Featured Products"
        />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
