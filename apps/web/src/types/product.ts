import { z } from "zod";

export enum ProductStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// export type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   description: string | null;
//   sizeChart: string | null;
//   brandId: number;
//   categoryId: number;
//   created_at: Date;
//   updated_at: Date;
// };
export type ProductByBrand = {
  id: number;
  name: string;
  description: string | null;
  image: string;
  category: string;
  status: ProductStatus;
};

export type ProductSummary = {
  name: string;
  brand: {
    name: string;
    slug: string;
  };
  slug: string;
  price: number;
  maxPrice?: number;
  salePrice?: number;
  image: string;
  stock: number;
  hasVariants: boolean;
  default_variant_id: number | null;
  colorVariants: string[] | null;
};

export type ProductDetails = {
  id: number;
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
  in_stock: boolean;
  total_stock: number;
  price_range: {
    min_price: string;
    max_price: string;
  };
  variants: ProductVariant[];
  default_variant_id: number | null;
  size_chart?: string;
  reviews: {
    count: number;
    rating: number;
  };
  related_products?: ProductSummary[];
};

export type ProductVariant = {
  id: number;
  sku: string;
  price: number;
  price_formatted: string;
  original_price: number | null;
  original_price_formatted: string | null;
  discount_percentage: number | null;
  stock: number;
  options: Record<string, string>;
  images: ProductImage[];
};

export type ProductImage = {
  url: string;
  alt_text: string;
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

export const selectedVariantSchema = z.object({
  id: z.number().optional(), // Add optional id for updates
  price: z.number().positive().optional(), // Make optional for updates
  stock: z.number().int().positive().optional(), // Make optional for updates
  options: z
    .array(
      z.object({
        optionId: z.number(),
        valueId: z.number(),
      }),
    )
    .optional(), // Make optional for updates
  images: z.array(z.string()).optional(), // Make optional for updates
});

export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  category: z
    .number()
    .min(1, { message: "Please select a category" })
    .optional(),
  description: z.string().optional(),
  variants: z.array(selectedVariantSchema).optional(),
});

export type SavedProductForm = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

export type SelectedVariant = z.infer<typeof selectedVariantSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;

export type SubmitProductFormValues = ProductFormValues & {
  brandId: number;
};

// Add new types for update operations
export type UpdateProductFormValues = {
  id: number;
  name?: string;
  slug: string;
  category?: number;
  description?: string;
  variants?: Array<{
    id?: number; // Optional for new variants
    price?: number;
    stock?: number;
    options?: Array<{
      optionId: number;
      valueId: number;
    }>;
    images?: string[];
  }>;
};

export type CreateProductFormValues = {
  name: string;
  category: number;
  description?: string;
  variants: Array<{
    price: number;
    stock: number;
    options: Array<{
      optionId: number;
      valueId: number;
    }>;
    images: string[];
  }>;
};
