"use client";

import React from "react";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/utils";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import { useParams } from "next/navigation";
import { ProductExtended } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const product = getProductBySlug(slug);
  const routeParams = useParams();
  const locale = routeParams.locale as string;

  if (!product) {
    notFound();
  }

  // Create an extended product with additional properties for structured data
  const extendedProduct: ProductExtended = {
    ...product,
    id: 123, // Placeholder ID
    slug: slug,
    description: `${product.name} by ${product.brand}`,
    category: "Home Goods",
    inStock: true,
    images: [{ url: product.image }],
  };

  const relatedProducts = getRelatedProducts(product, 4);

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}` },
    { name: "Products", url: `/${locale}/browse` },
    { name: product.name, url: `/${locale}/product/${slug}` },
  ];

  return (
    <>
      <ProductSchema product={extendedProduct} locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductDetails product={product} />

      {/* Related Products */}
      <div className="mx-auto w-full max-w-screen-2xl">
        <ProductGrid
          products={relatedProducts}
          title="You May Also Like"
          className="mt-4 mb-6 sm:mt-6 sm:mb-8 md:mt-10 md:mb-10 lg:mt-16 lg:mb-12"
        />
      </div>
    </>
  );
}
