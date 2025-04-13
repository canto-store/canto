"use client";

import React from "react";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { getMockProductBySlug, getRelatedProducts } from "@/lib/utils";
import { ProductDetails } from "@/components/products/ProductDetails";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const product = getMockProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  // const breadcrumbItems = [
  //   { name: "Home", url: `/${locale}` },
  //   { name: "Products", url: `/${locale}/browse` },
  //   { name: product.name, url: `/${locale}/product/${slug}` },
  // ];

  return (
    <>
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
