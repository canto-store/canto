"use client";

import { ProductSummary } from "@/types/product";
import { CartItem } from "@/types";
import { createContext } from "react";

export interface CartContextType {
  items: CartItem[];
  count: number;
  totalPrice: number;
  addToCart: (product: ProductSummary, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  clearLocalCart: () => void;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
  clearLocalCart: () => {},
  isLoading: false,
});
