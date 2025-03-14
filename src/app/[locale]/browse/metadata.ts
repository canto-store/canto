import { Metadata } from "next";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://canto.com";

  return {
    title: "Browse Products",
    description:
      "Browse our wide selection of products. Find the latest trends in fashion, electronics, home goods, and more on Canto.",
    keywords: ["browse", "products", "marketplace", "canto", "shopping"],
    openGraph: {
      title: "Browse Products - Canto",
      description:
        "Browse our wide selection of products. Find the latest trends in fashion, electronics, home goods, and more on Canto.",
      url: `${baseUrl}/${locale}/browse`,
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
      title: "Browse Products - Canto",
      description:
        "Browse our wide selection of products. Find the latest trends in fashion, electronics, home goods, and more on Canto.",
      images: [`${baseUrl}/web-app-manifest-512x512.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/browse`,
      languages: {
        en: `${baseUrl}/en/browse`,
        ar: `${baseUrl}/ar/browse`,
      },
    },
  };
}
