import { ProductSummary } from "./product";

export type CartItem = ProductSummary & {
  quantity: number;
};
