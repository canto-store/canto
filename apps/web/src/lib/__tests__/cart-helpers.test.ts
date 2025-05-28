import {
  calculateTotals,
  updateExistingItem,
  addNewItem,
  processNewItem,
} from "../cart-helpers";
import { CartItem } from "@/types/cart-item";

describe("Cart Helpers", () => {
  const mockItems: CartItem[] = [
    {
      variantId: 1,
      price: 10,
      quantity: 2,
      name: "Test Product 1",
      brand: {
        name: "Test Brand",
        slug: "test-brand",
      },
      slug: "test-product-1",
      image: "test-image-1.jpg",
      stock: 10,
    },
    {
      variantId: 2,
      price: 15,
      quantity: 1,
      name: "Test Product 2",
      brand: {
        name: "Test Brand",
        slug: "test-brand",
      },
      slug: "test-product-2",
      image: "test-image-2.jpg",
      stock: 5,
    },
  ];

  describe("calculateTotals", () => {
    it("should calculate correct totals for empty cart", () => {
      const result = calculateTotals([]);
      expect(result).toEqual({ price: 0, count: 0 });
    });

    it("should calculate correct totals for items", () => {
      const result = calculateTotals(mockItems);
      expect(result).toEqual({ price: 35, count: 3 }); // (10 * 2) + (15 * 1) = 35, 2 + 1 = 3
    });
  });

  describe("updateExistingItem", () => {
    it("should update quantity of existing item", () => {
      const newItem: CartItem = {
        ...mockItems[0],
        quantity: 3,
      };
      const result = updateExistingItem(mockItems, newItem);
      expect(result).toEqual([
        { ...mockItems[0], quantity: 5 }, // 2 + 3
        mockItems[1],
      ]);
    });

    it("should not modify other items", () => {
      const newItem: CartItem = {
        ...mockItems[0],
        quantity: 3,
      };
      const result = updateExistingItem(mockItems, newItem);
      expect(result[1]).toEqual(mockItems[1]);
    });
  });

  describe("addNewItem", () => {
    it("should add new item to cart", () => {
      const newItem: CartItem = {
        variantId: 3,
        price: 20,
        quantity: 1,
        name: "Test Product 3",
        brand: {
          name: "Test Brand",
          slug: "test-brand",
        },
        slug: "test-product-3",
        image: "test-image-3.jpg",
        stock: 8,
      };
      const result = addNewItem(mockItems, newItem);
      expect(result).toEqual([...mockItems, newItem]);
    });

    it("should not modify existing items", () => {
      const newItem: CartItem = {
        variantId: 3,
        price: 20,
        quantity: 1,
        name: "Test Product 3",
        brand: {
          name: "Test Brand",
          slug: "test-brand",
        },
        slug: "test-product-3",
        image: "test-image-3.jpg",
        stock: 8,
      };
      const result = addNewItem(mockItems, newItem);
      expect(result.slice(0, -1)).toEqual(mockItems);
    });
  });

  describe("processNewItem", () => {
    it("should update existing item", () => {
      const newItem: CartItem = {
        ...mockItems[0],
        quantity: 3,
      };
      const result = processNewItem(mockItems, newItem);
      expect(result).toEqual([
        { ...mockItems[0], quantity: 5 }, // 2 + 3
        mockItems[1],
      ]);
    });

    it("should add new item if it doesn't exist", () => {
      const newItem: CartItem = {
        variantId: 3,
        price: 20,
        quantity: 1,
        name: "Test Product 3",
        brand: {
          name: "Test Brand",
          slug: "test-brand",
        },
        slug: "test-product-3",
        image: "test-image-3.jpg",
        stock: 8,
      };
      const result = processNewItem(mockItems, newItem);
      expect(result).toEqual([...mockItems, newItem]);
    });

    it("should maintain item order", () => {
      const newItem: CartItem = {
        variantId: 3,
        price: 20,
        quantity: 1,
        name: "Test Product 3",
        brand: {
          name: "Test Brand",
          slug: "test-brand",
        },
        slug: "test-product-3",
        image: "test-image-3.jpg",
        stock: 8,
      };
      const result = processNewItem(mockItems, newItem);
      expect(result.slice(0, -1)).toEqual(mockItems);
    });
  });
});
