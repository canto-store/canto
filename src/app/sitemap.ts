import { MetadataRoute } from "next";
import {
  FEATURED_PRODUCTS,
  NEW_ARRIVALS,
  BEST_SELLERS,
} from "@/lib/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto.com";

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en/browse`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ar/browse`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Combine all products for product pages
  const allProducts = [
    ...FEATURED_PRODUCTS,
    ...NEW_ARRIVALS,
    ...BEST_SELLERS,
  ].filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.name === product.name),
  );

  // Product routes - using product name as slug
  const productRoutes = allProducts.flatMap((product) => {
    const slug = product.name.replace(/\s+/g, "-").toLowerCase();
    return [
      {
        url: `${baseUrl}/en/product/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/ar/product/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
  });

  return [...staticRoutes, ...productRoutes];
}
