export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  translationKey?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Summer Collection 2025",
    subtitle: "Discover the latest trends in luxury fashion",
    translationKey: "summer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=2000&h=1125",
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
  {
    image:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&q=80&w=2000&h=1125",
    title: "Accessories Collection",
    subtitle: "Complete your look with premium accessories",
    translationKey: "accessories",
  },
];
