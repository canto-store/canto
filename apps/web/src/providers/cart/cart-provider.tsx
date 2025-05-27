"use client";

import { useState, useEffect, ReactNode } from "react";
import { ProductSummary } from "@/types/product";
import { CartItem } from "@/types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CartContext } from "./cart-context";
import { useAddToCart, useDeleteFromCart, useGetCart } from "@/lib/cart";
import { useAuth } from "@/providers/auth/use-auth";
import api from "@/lib/api";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasSynced, setHasSynced] = useState(false);
  const { isAuthenticated } = useAuth();
  const { data: serverCart, isLoading, refetch } = useGetCart();

  const { mutate: addToCartMutation } = useAddToCart();
  const { mutate: deleteFromCartMutation } = useDeleteFromCart();
  const t = useTranslations();

  // Initialize cart from localStorage on client-side only
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Reset sync flag when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasSynced(false);
    }
  }, [isAuthenticated]);

  // Sync local cart with server when user authenticates
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (isAuthenticated && items.length > 0 && !hasSynced) {
        try {
          const { status } = await api.post("/cart/user", {
            items: items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          });
          if (status === 200) {
            localStorage.removeItem("cart");
            setHasSynced(true);
            refetch(); // Refresh the server cart data
          }
        } catch (error) {
          console.error("Failed to sync cart with server:", error);
        }
      }
    };

    syncCartWithServer();
  }, [isAuthenticated, items, refetch, hasSynced]);

  // Calculate total count and price
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (serverCart && isAuthenticated) {
      setItems(serverCart);
    }
  }, [serverCart, isAuthenticated]);

  // Add an item to the cart
  const addToCart = (product: ProductSummary, quantity = 1) => {
    if (!product.variantId) return toast.error("ERROR");

    if (isAuthenticated) {
      addToCartMutation({ variantId: product.variantId, quantity });
    } else {
      const existingItem = items.find(
        (item) => item.variantId === product.variantId,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        setItems([...items, { ...product, quantity }]);
      }
    }
    toast(t("products.addedToCart", { productName: product.name }));
  };

  // Remove an item from the cart
  const removeItem = (productId: number) => {
    if (isAuthenticated) {
      deleteFromCartMutation({ variantId: productId });
    } else {
      setItems(items.filter((item) => item.variantId !== productId));
    }
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems(
        items.map((item) =>
          item.variantId === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  // Clear the cart
  const clearCart = () => {
    if (!isAuthenticated) {
      setItems([]);
    }
  };

  const clearLocalCart = () => {
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
        totalPrice,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        isLoading,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
