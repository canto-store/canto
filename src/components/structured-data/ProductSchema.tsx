import { ProductExtended } from "@/types/product";

interface ProductSchemaProps {
  product: ProductExtended;
  locale: string;
}

export function ProductSchema({ product, locale }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto.com";

  // Create a simplified product schema with available data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((image) => image.url) || [product.image],
    description: product.description || `${product.name} by ${product.brand}`,
    sku:
      product.id?.toString() ||
      "SKU-" + product.name.replace(/\s+/g, "-").toLowerCase(),
    mpn:
      product.id?.toString() ||
      "MPN-" + product.name.replace(/\s+/g, "-").toLowerCase(),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/${locale}/product/${product.slug || product.name.replace(/\s+/g, "-").toLowerCase()}`,
      priceCurrency: "EGP",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Canto",
      },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toString(),
        reviewCount: "100",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
    />
  );
}
