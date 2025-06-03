import { ProductSummary } from "./product";

export type CartItem = Omit<
  ProductSummary,
  "hasVariants" | "colorVariants" | "default_variant_id"
> & {
  variantId: number;
  quantity: number;
};
