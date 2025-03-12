"use client";

import React from "react";
import { AppLayout } from "@/components/layout";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/utils";
import { ProductDetails } from "@/app/components/product/ProductDetails";

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
      <ProductGrid
        products={relatedProducts}
        title="You May Also Like"
        className="mt-8 md:mt-16"
      />
    </AppLayout>
  );
}
