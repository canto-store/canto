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
  stock: number;
};

export type ProductDetails = {
  name: string;
  slug: string;
  description: string;
  brand: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
  options: ProductOptionTemp[];
  price_range: {
    min_price: number;
    max_price: number;
  };
  variants: ProductVariants[];
  size_chart?: string;
  reviews: {
    count: number;
    rating: number;
  };
  related_products?: ProductSummary[];
};

export type Color = {
  name: string;
  value: string;
};

export type ProductVariants = {
  sku: string;
  price: number;
  stock: number;
  options: ProductOption[];
  images: ProductImages[];
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

export type ProductImages = {
  url: string;
  alt_text: string;
};
export interface ProductOption {
  id: number;
  name: string;
  values: OptionValue[];
}

export type ProductOptionTemp = {
  name: string;
  values: string[];
};