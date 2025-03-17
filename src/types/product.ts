export type Product = {
  name: string;
  brand: string;
  price: number;
  image: string;
  translationKey?: {
    name: string;
    brand: string;
  };
};

// Extended product type for structured data
export type ProductExtended = Product & {
  id: number;
  slug: string;
  description: string;
  category: string;
  inStock: boolean;
  rating?: number;
  images: { url: string }[];
};

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  short_desc: string;
  price: number;
  sale_price: number | null;
  review: number;
  ratings: number;
  until: string | null;
  stock: number;
  top: boolean;
  featured: boolean;
  new: boolean;
  best_seller: boolean;
  best_deal: boolean;
  new_arrival: boolean;
  author: string;
  sold: number;
  category: Array<{
    name: string;
    slug: string;
  }>;
  sm_pictures: Array<{ url: string }>;
};

export type HomeProductsApiResponse = {
  products: {
    Fashion: ApiProduct[];
    sections: Record<string, unknown>[];
  };
};

export type HomeProductsData = {
  featured: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
};
