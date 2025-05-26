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

export const selectedVariantSchema = z.object({
  price: z.number().positive(),
  stock: z.number().int().positive(),
  options: z.array(
    z.object({
      optionId: z.number(),
      valueId: z.number(),
    }),
  ),
  images: z.array(z.string()).min(1, {
    message: "Please upload at least one image for this variant",
  }),
});

export const productFormSchema = z.object({
  name: z.string(),
  category: z.number().min(1, { message: "Please select a category" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  variants: z.array(selectedVariantSchema),
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
