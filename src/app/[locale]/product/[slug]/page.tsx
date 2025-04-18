"use client";

import React from "react";
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
interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const { slug } = resolvedParams;

  const { data: product, isError } = useProduct(slug);
  const locale = useLocale();

  if (isError) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: `/${locale}/` },
    { name: "Category", url: `/${locale}/browse` },
    { name: product?.name, url: `/${locale}/product/${slug}` },
  ];

  if (product)
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
                {index !== breadcrumbItems.length - 1 && (
                  <BreadcrumbSeparator />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <ProductDetails product={product} />

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <>
            <div className="mt-10 mb-10">
              <h3 className="mb-3 text-lg font-semibold sm:mb-4 md:mb-6 md:text-xl">
                You May Also Like
              </h3>
            </div>
            <ProductGrid
              products={product.relatedProducts}
              title="You May Also Like"
              className="mt-10 mb-10"
            />
          </>
        )}
      </div>
    );
}
