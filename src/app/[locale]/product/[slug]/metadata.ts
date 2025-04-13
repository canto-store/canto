import { Metadata } from "next";
import { getProductBySlug } from "@/lib/utils";

interface Props {
  params: { slug: string; locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto-store.com";
  const productDescription = `${product.name} by ${product.brand}. Available on Canto.`;

  return {
    title: product.name,
    description: productDescription,
    keywords: [
      product.brand,
      "product",
      "canto",
      "marketplace",
      "egyptian marketplace",
    ],
    openGraph: {
      title: product.name,
      description: productDescription,
      url: `${baseUrl}/${locale}/product/${slug}`,
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: productDescription,
      images: [product.image],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/product/${slug}`,
      languages: {
        en: `${baseUrl}/en/product/${slug}`,
        ar: `${baseUrl}/ar/product/${slug}`,
      },
    },
  };
}
