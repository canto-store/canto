import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ALL_PRODUCTS, type Product } from "@/lib/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug,
  );
}

// Get related products
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return ALL_PRODUCTS.filter((p) => p.name !== product.name).slice(0, limit);
}

// Filter products by search query, category, price range, and brand
export function filterProducts(
  searchQuery: string,
  category: string,
  priceRange: { min: number; max: number },
  brand: string = "All",
): Product[] {
  let filtered = ALL_PRODUCTS;

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query),
    );
  }

  // Filter by category (skip if "All" is selected)
  if (category !== "All") {
    // This is a simplified example - in a real app, products would have category data
    // For now, we'll just filter based on some arbitrary rules
    const categoryMap: Record<string, (product: Product) => boolean> = {
      Streetwear: (p) =>
        p.brand === "STREET CULTURE" || p.brand === "ESSENTIALS",
      Accessories: (p) =>
        p.name.includes("Watch") ||
        p.name.includes("Sunglasses") ||
        p.name.includes("Bag"),
      Sneakers: (p) => p.name.includes("Sneakers"),
      Denim: (p) => p.name.includes("Denim") || p.name.includes("Jeans"),
      Basics: (p) => p.brand === "ESSENTIALS" || p.name.includes("T-Shirt"),
      Luxury: (p) => p.price > 200,
    };

    if (categoryMap[category]) {
      filtered = filtered.filter(categoryMap[category]);
    }
  }

  // Filter by brand (skip if "All" is selected)
  if (brand !== "All") {
    filtered = filtered.filter((product) => product.brand === brand);
  }

  // Filter by price range
  filtered = filtered.filter(
    (product) =>
      product.price >= priceRange.min && product.price <= priceRange.max,
  );

  return filtered;
}
