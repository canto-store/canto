"use client";

import { useState, useEffect, ReactNode } from "react";
import { ProductSummary } from "@/types/product";
import { CartItem } from "@/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CartContext } from "./cart-context";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [, setIsInitialized] = useState(false);

  const t = useTranslations();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Calculate total count and price
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Add an item to the cart
  const addToCart = (product: ProductSummary, quantity = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.name === product.name,
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
    toast(t("products.addedToCart", { productName: product.name }));
  };

  // Remove an item from the cart
  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.name !== productId),
    );
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Check if an item is in the cart
  const isInCart = (productId: string) => {
    return items.some((item) => item.name === productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
