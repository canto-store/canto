export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  translationKey?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in luxury fashion",
    translationKey: "summer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Exclusive Brands",
    subtitle: "Shop designer collections",
    translationKey: "exclusive",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "New Arrivals",
    subtitle: "Be the first to shop new styles",
    translationKey: "newArrivals",
  },
];
