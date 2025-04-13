export type ProductSummary = {
  name: string;
  brand: string;
  slug: string;
  price: number;
  sale_price?: number;
  image: string;
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

export interface HomeProducts {
  best_deal: ProductSummary[];
  best_seller: ProductSummary[];
  new_arrival: ProductSummary[];
  products: ProductSummary[];
  sections: Record<string, unknown>[];
}
