export type ProductSummary = {
  name: string;
  brand: string;
  slug: string;
  price: number;
  sale_price?: number;
  images: string[];
};

export type ProductDetails = {
  name: string;
  brand: string;
  price: number;
  sale_price?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  reviews: {
    count: number;
    rating: number;
  };
  relatedProducts: ProductSummary[];
};

export type HomeProducts = {
  featured: ProductSummary[];
  newArrivals: ProductSummary[];
  bestSellers: ProductSummary[];
};
