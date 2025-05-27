import { ProductSummary } from "./product";

export type CartItem = Omit<ProductSummary, "hasVariants" | "colorVariants"> & {
  quantity: number;
};
