"use client";

import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProducts } from "@/components/home/HomeProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES } from "@/lib/data/hero-slides";
import { HomeCategories } from "@/components/home/HomeCategories";
import { useHomeProducts } from "@/lib/product";
import { useCartStore, useGetCart } from "@/lib/cart";
import { useEffect } from "react";

export default function Home() {
  const { data, isError, isLoading } = useHomeProducts();
  const { bestDeals, bestSellers, newArrivals } = data || {};
  const { data: cart, isStale } = useGetCart();
  const { setItems } = useCartStore();

  useEffect(() => {
    if (cart && !isStale) {
      setItems(cart);
    }
  }, [cart, isStale, setItems]);

  return (
    <>
      <HeroSlider slides={HERO_SLIDES} />
      <FeaturesBanner />
      {!isLoading && !isError && (
        <>
          <HomeProducts products={bestDeals} title="Best Deals" />

          <HomeCategories />

          <HomeProducts products={bestSellers} title="Best Sellers" />

          <HomeProducts products={newArrivals} title="New Arrivals" />
        </>
      )}
    </>
  );
}
