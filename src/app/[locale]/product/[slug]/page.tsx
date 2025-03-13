"use client";

import React from "react";
import { AppLayout } from "@/components/layout";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/utils";
import { ProductDetails } from "@/components/products/ProductDetails";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <AppLayout theme="default">
      <ProductDetails product={product} />

      {/* Related Products */}
      <div className="mx-auto w-full max-w-screen-2xl">
        <ProductGrid
          products={relatedProducts}
          title="You May Also Like"
          className="mt-4 mb-6 sm:mt-6 sm:mb-8 md:mt-10 md:mb-10 lg:mt-16 lg:mb-12"
        />
      </div>
    </AppLayout>
  );
}
