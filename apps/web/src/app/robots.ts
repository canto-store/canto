import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/api/*",
        "/(auth)/*",
        "/(protected)/*",
        "/checkout/*",
        "/cart/*",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://canto-store.com"}/sitemap.xml`,
  };
}
