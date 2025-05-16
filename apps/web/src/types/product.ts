export type ProductSummary = {
  name: string;
  brand: {
    name: string;
    slug: string;
  };
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
};

export type ProductDetails = {
  name: string;
  brand: string;
  price: number;
  sale_price?: number;
  images: string[];
  category: string;
  sizes?: string[];
  colors?: Color[];
  stock: number;
  description: string;
  reviews: {
    count: number;
    rating: number;
  };
  relatedProducts?: ProductSummary[];
};

export type Color = {
  name: string;
  value: string;
};

export interface HomeProducts {
  bestSellers: ProductSummary[];
  bestDeals: ProductSummary[];
  newArrivals: ProductSummary[];
}

export interface OptionValue {
  id: number;
  value: string;
}

export interface ProductOption {
  id: number;
  name: string;
  values: OptionValue[];
}
