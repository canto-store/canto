import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { toast } from "sonner";
import { CartItem } from "@/types/cart-item";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateTotals, processNewItem } from "./cart-helpers";
interface AddToCartInput {
  variantId: number;
  quantity: number;
}

export const useAddToCart = () => {
  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      const response = await api.post("/cart/items", {
        variantId,
        quantity,
      });
      return response.data;
    },
  });
};

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get<CartItem[]>("/cart/user");
      return response.data;
    },
  });
};

export const useUpdateCartItem = () => {
  return useMutation({
    mutationFn: async ({
      variantId,
      quantity,
    }: {
      variantId: number;
      quantity: number;
    }) => {
      const response = await api.put("/cart/items", { variantId, quantity });
      return response.data;
    },
  });
};

export const useSyncCart = () => {
  return useMutation({
    mutationFn: async (items: { variantId: number; quantity: number }[]) => {
      const response = await api.put<CartItem[]>("/cart/user", { items });
      return response.data;
    },
  });
};
export const useDeleteFromCart = () => {
  return useMutation({
    mutationFn: async ({ variantId }: { variantId: number }) => {
      const response = await api.delete("/cart/items", {
        data: { variantId },
      });
      return response.data;
    },
  });
};

interface CartState {
  items: CartItem[];
  price: number;
  count: number;
  synced: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateItem: (variantId: number, quantity: number) => void;
  addItems: (items: CartItem[]) => void;
  clearCart: () => void;
  setSynced: (synced: boolean) => void;
}

const initialState = {
  items: [],
  price: 0,
  count: 0,
  synced: false,
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      ...initialState,
      addItem: (item) => {
        set((state) => {
          const updatedItems = processNewItem(state.items, item);
          const { price, count } = calculateTotals(updatedItems);
          return { items: updatedItems, price, count };
        });
        toast.success("Item added to cart");
      },
      removeItem: (variantId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.variantId !== variantId,
          );
          const { price, count } = calculateTotals(updatedItems);
          return { items: updatedItems, price, count };
        });
      },
      updateItem: (variantId, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          );
          const { price, count } = calculateTotals(updatedItems);
          return { items: updatedItems, price, count };
        });
      },
      addItems: (items: CartItem[]) => {
        set((state) => {
          const existingItems = state.items.filter(
            (item) => !items.some((i) => i.variantId === item.variantId),
          );
          const newItems = items.filter(
            (item) =>
              !existingItems.some((i) => i.variantId === item.variantId),
          );
          const updatedItems = [...existingItems, ...newItems];
          const { price, count } = calculateTotals(updatedItems);
          return { items: updatedItems, price, count };
        });
      },
      clearCart: () => {
        set(initialState);
      },
      setSynced: (synced: boolean) => {
        set({ synced });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
