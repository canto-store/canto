import { type Product } from "@/components/products";

// Sample product data - in a real app, this would come from an API
export const ALL_PRODUCTS: Product[] = [
  {
    name: "Oversized Cotton Hoodie",
    brand: "ESSENTIALS",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Classic Denim Jacket",
    brand: "VINTAGE",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Minimalist Watch",
    brand: "TIMELESS",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Premium Leather Sneakers",
    brand: "LUXE STEPS",
    price: 259.99,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Slim Fit Jeans",
    brand: "DENIM CO",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Cashmere Sweater",
    brand: "LUXE KNITS",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Leather Crossbody Bag",
    brand: "URBAN CARRY",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Aviator Sunglasses",
    brand: "SHADE MASTERS",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Wireless Headphones",
    brand: "AUDIO PRO",
    price: 179.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Graphic T-Shirt",
    brand: "STREET CULTURE",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Canvas Backpack",
    brand: "NOMAD",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Minimalist Sneakers",
    brand: "CLEAN KICKS",
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600&h=600",
  },
];

// Categories for filtering
export const CATEGORIES = [
  "All",
  "Streetwear",
  "Accessories",
  "Sneakers",
  "Denim",
  "Basics",
  "Luxury",
];

// Brands for filtering
export const BRANDS = [
  "All",
  ...Array.from(new Set(ALL_PRODUCTS.map((product) => product.brand))),
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: Infinity },
];

// Product sizes
export const SIZES = ["XS", "S", "M", "L", "XL"];

// Product colors
export const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#808080" },
  { name: "Blue", value: "#0000FF" },
];

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
