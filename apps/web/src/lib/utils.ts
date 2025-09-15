import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { APIError } from "@/types/api";
import { ProductSummary } from "@/types/product";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};

// Filter products by search query, category, price range, and brand
export function filterProducts(
  searchQuery: string,
  category: string,
  priceRange: { min: number; max: number },
  brand: string = "All",
): ProductSummary[] {
  let filtered: ProductSummary[] = [];

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.slug.includes(query),
    );
  }

  // Filter by category (skip if "All" is selected)
  if (category !== "All") {
    // This is a simplified example - in a real app, products would have category data
    // For now, we'll just filter based on some arbitrary rules
    const categoryMap: Record<string, (product: ProductSummary) => boolean> = {
      Streetwear: (p) =>
        p.brand.name === "STREET CULTURE" || p.brand.name === "ESSENTIALS",
      Accessories: (p) =>
        p.name.includes("Watch") ||
        p.name.includes("Sunglasses") ||
        p.name.includes("Bag"),
      Sneakers: (p) => p.name.includes("Sneakers"),
      Denim: (p) => p.name.includes("Denim") || p.name.includes("Jeans"),
      Basics: (p) =>
        p.brand.name === "ESSENTIALS" || p.name.includes("T-Shirt"),
      Luxury: (p) => p.price > 200,
    };

    if (categoryMap[category]) {
      filtered = filtered.filter(categoryMap[category]);
    }
  }

  // Filter by brand (skip if "All" is selected)
  if (brand !== "All") {
    filtered = filtered.filter((product) => product.brand.name === brand);
  }

  // Filter by price range
  filtered = filtered.filter(
    (product) =>
      product.price >= priceRange.min && product.price <= priceRange.max,
  );

  return filtered;
}

export function getUserRole(
  role: string[] | undefined,
): "USER" | "SELLER" | "GUEST" {
  if (!role || role.length === 0) return "GUEST";
  if (role.includes("SELLER")) return "SELLER";
  return "USER";
}

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as APIError)?.message;
    if (message) return message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}
