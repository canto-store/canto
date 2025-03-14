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
