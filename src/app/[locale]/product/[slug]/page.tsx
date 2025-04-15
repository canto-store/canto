"use client";

import React from "react";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { getMockProductBySlug, getRelatedProducts } from "@/lib/utils";
import { ProductDetails } from "@/components/products/ProductDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocale } from "next-intl";
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;
  const product = getMockProductBySlug(slug);
  const locale = useLocale();

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}/` },
    { name: "Category", url: `/${locale}/browse` },
    { name: product.name, url: `/${locale}/product/${slug}` },
  ];

  return (
    <div className="mt-3 flex flex-col md:mt-7">
      <Breadcrumb className=" ">
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.url}
                  className="text-primary/90 text-sm"
                >
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <ProductDetails product={product} />

      {/* Related Products */}
      <ProductGrid
        products={relatedProducts}
        title="You May Also Like"
        className="mt-10 mb-10"
      />
    </div>
  );
}
