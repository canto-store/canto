"use client";

import { HomeProducts } from "@/components/home/HomeProducts";
// import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HomeCategories } from "@/components/home/HomeCategories";
import { useHomeProducts } from "@/lib/product";
import { useCartStore, useGetCart } from "@/lib/cart";
import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const { data, isLoading } = useHomeProducts();
  const { bestDeals, bestSellers, newArrivals } = data || {};
  const { data: cart, isStale } = useGetCart();
  const { setItems } = useCartStore();
  const t = useTranslations();

  useEffect(() => {
    if (cart && !isStale) {
      setItems(cart);
    }
  }, [cart, isStale, setItems]);

  return (
    <>
      <section className="relative right-[50%] left-[50%] -mx-[50vw] h-[calc(100vh-6.5rem-5rem)] w-screen max-w-none md:h-[calc(100vh-6.5rem)]">
        <Image
          src="https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimhqIo98vnb96RaXBYDdPWv37yFwM4pKkIchN5"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
      </section>
      <HomeProducts
        products={bestDeals}
        title="Canto's Deals"
        isLoading={isLoading}
      />
      <HomeCategories />
      <HomeProducts
        products={bestSellers}
        title="Best Sellers"
        isLoading={isLoading}
      />
      <HomeProducts
        products={newArrivals}
        title="New Arrivals"
        isLoading={isLoading}
      />
      {/* <FeaturesBanner /> */}
      <section>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center sm:px-6 lg:px-8">
          <RotateCcw className="mb-3 h-8 w-8 text-gray-500 sm:mb-4" />
          <h3 className="text-xs font-medium text-gray-500 uppercase sm:text-sm">
            {t("features.return.title")}
          </h3>
          <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
            {t("features.return.description")}
          </p>
        </div>
      </section>
    </>
  );
}
