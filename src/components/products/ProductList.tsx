"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { ProductSummary } from "@/types";
import { SectionContainer } from "@/components/common";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/providers";

interface ProductListProps {
  products: ProductSummary[];
  title?: string;
  className?: string;
}

export function ProductList({ products, title, className }: ProductListProps) {
  const t = useTranslations("products");
  const params = useParams();
  const isRTL = params?.locale === "ar";

  const { addToCart } = useCart();
  return (
    <SectionContainer title={title}>
      <div className={cn("space-y-4", className)} dir={isRTL ? "rtl" : "ltr"}>
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md sm:flex-row"
          >
            <div
              className={`relative aspect-square h-auto w-full overflow-hidden sm:aspect-square sm:h-auto sm:w-48 md:w-56 lg:w-64 ${isRTL ? "sm:order-2" : ""}`}
            >
              <Image
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                width={300}
                height={300}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                quality={85}
              />
            </div>
            <div
              className={`flex flex-1 flex-col justify-between p-4 ${isRTL ? "text-right sm:order-1" : ""}`}
            >
              <div>
                <h3 className="mb-1 text-lg font-semibold text-black">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.brand}</p>
              </div>
              <div
                className={`mt-4 flex items-center ${isRTL ? "flex-row-reverse" : ""} justify-between`}
              >
                <div className="flex items-center gap-0.5">
                  <span className="text-xs font-bold md:text-base">EGP</span>
                  {product.sale_price && (
                    <span className="font-bold sm:text-lg md:text-xl">
                      {product.sale_price}
                    </span>
                  )}
                  <span
                    className={cn(
                      product.sale_price
                        ? "text-gray-500 line-through sm:text-sm md:text-base"
                        : "font-bold sm:text-lg md:text-xl",
                    )}
                  >
                    {product.price}
                  </span>
                </div>
                <div
                  className={`flex ${isRTL ? "flex-row-reverse" : ""} gap-2`}
                >
                  <Button
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="gap-1"
                  >
                    <ShoppingCart
                      className={cn("h-4 w-4", isRTL && "mr-0 ml-1")}
                    />
                    {t("add")}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link
                      href={`/product/${encodeURIComponent(
                        product.name.toLowerCase().replace(/\s+/g, "-"),
                      )}`}
                    >
                      <Eye className={cn("h-4 w-4", isRTL && "mr-0 ml-1")} />
                      {t("view")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
