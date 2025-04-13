"use client";

import { ProductSummary } from "@/types/product";
import { CartItem } from "@/types";
import { createContext } from "react";

export interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  addToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
});
