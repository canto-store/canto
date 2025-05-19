"use client";

import React, { Suspense } from "react";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/ProductDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocale } from "next-intl";
import { useProduct } from "@/lib/product";
import ProductDetailLoading from "./loading";
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const { data: product, isError, isLoading } = useProduct(slug);
  const locale = useLocale();

  if (isError) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}/` },
    {
      name: product?.category.name,
      url: `/${locale}/browse?category=${product?.category.slug}`,
    },
    { name: product?.name, url: `/${locale}/product/${slug}` },
  ];

  if (isLoading) {
    return <ProductDetailLoading />;
  }

  if (product)
    return (
      <div className="mt-3 flex flex-col md:mt-7">
        <Breadcrumb>
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
                {index !== breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <Suspense fallback={<ProductDetailLoading />}>
          <ProductDetails product={product} />
        </Suspense>

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <ProductGrid
            products={product.related_products}
            title="You May Also Like"
            className="mt-10 mb-10"
          />
        )}
      </div>
    );
}
