import { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto.com";

  return {
    title: "Canto - Egyptian Marketplace",
    description:
      "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
    keywords: [
      "marketplace",
      "online shopping",
      "ecommerce",
      "products",
      "canto",
      "egyptian marketplace",
    ],
    openGraph: {
      title: "Canto - Egyptian Marketplace",
      description:
        "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
      url: `${baseUrl}/${locale}`,
      type: "website",
      images: [
        {
          url: `${baseUrl}/web-app-manifest-512x512.png`,
          width: 512,
          height: 512,
          alt: "Canto Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Canto - Egyptian Marketplace",
      description:
        "Shop the latest trends in fashion, electronics, home goods, and more on Canto. Discover new arrivals, featured products, and best sellers with fast shipping and secure checkout.",
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
  };
}
