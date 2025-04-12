export type Product = {
  name: string;
  brand: string;
  price: number;
  image: string;
  translationKey?: {
    name: string;
    brand: string;
  };
  id: number;
  slug: string;
  description: string;
  category: string;
  inStock: boolean;
  rating?: number;
  images: { url: string }[];
};

export type HomeProductsData = {
  featured: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
};
