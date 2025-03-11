import { ALL_PRODUCTS } from "./products";

export const BRANDS = [
  "All",
  ...Array.from(new Set(ALL_PRODUCTS.map((product) => product.brand))),
];
