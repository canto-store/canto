"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type Product } from "@/components/products/ProductCard";

// Define the cart item type with quantity
export interface CartItem extends Product {
  quantity: number;
}

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

// Create the cart context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // Initialize cart state from localStorage if available
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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
  const addItem = (product: Product, quantity = 1) => {
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
        addItem,
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
