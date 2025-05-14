"use client";

import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProducts } from "@/components/home/HomeProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES } from "@/lib/data/hero-slides";
import { HomeCategories } from "@/components/home/HomeCategories";
import { useHomeProducts } from "@/lib/product";

export default function Home() {
  const { data, isError, isLoading } = useHomeProducts();
  const { bestDeals, bestSellers, newArrivals } = data || {};

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
