"use client";

import { HomeProducts } from "@/components/home/HomeProducts";
import { HomeCategories } from "@/components/home/HomeCategories";
import { useHomeProducts } from "@/lib/product";
import Image from "next/image";
import { useGetCart } from "@/lib/cart";
import banner from "../../../public/banner.png";
import bannerMobile from "../../../public/mobile-banner.png";
import { useIsInstalled } from "@/hooks/useIsInstalled";

export default function Home() {
  const { data, isLoading } = useHomeProducts();
  const { bestDeals, bestSellers, newArrivals } = data || {};
  useGetCart();
  const isInstalled = useIsInstalled();

  return (
    <>
      {isInstalled ? (
        <section className="relative right-[50%] left-[50%] -mx-[50vw] block h-[calc(100vh-3.5rem-5rem)] w-screen max-w-none sm:hidden">
          <Image
            src={bannerMobile}
            alt="Hero Mobile"
            fill
            className="object-fill"
            priority
          />
        </section>
      ) : (
        <section className="relative right-[50%] left-[50%] -mx-[50vw] block h-[calc(100vh-3.5rem)] w-screen max-w-none sm:hidden">
          <Image
            src={bannerMobile}
            alt="Hero Mobile"
            fill
            className="object-fill"
            priority
          />
        </section>
      )}
      <section className="relative right-[50%] left-[50%] -mx-[50vw] hidden h-[calc(100vh-3.5rem)] w-screen max-w-none sm:block">
        <Image
          src={banner}
          alt="Hero Tablet"
          fill
          className="object-cover lg:object-fill"
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
    </>
  );
}
