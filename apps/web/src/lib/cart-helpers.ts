import { CartItem } from "@/types/cart-item";

export const calculateTotals = (items: CartItem[]) => {
  return {
    price: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    count: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};

export const updateExistingItem = (
  items: CartItem[],
  newItem: CartItem,
): CartItem[] => {
  return items.map((i) =>
    i.variantId === newItem.variantId
      ? { ...i, quantity: i.quantity + newItem.quantity }
      : i,
  );
};

export const addNewItem = (
  items: CartItem[],
  newItem: CartItem,
): CartItem[] => {
  return [...items, newItem];
};

export const processNewItem = (
  currentItems: CartItem[],
  newItem: CartItem,
): CartItem[] => {
  const existingItem = currentItems.find(
    (i) => i.variantId === newItem.variantId,
  );
  return existingItem
    ? updateExistingItem(currentItems, newItem)
    : addNewItem(currentItems, newItem);
};
