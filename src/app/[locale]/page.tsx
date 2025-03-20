"use client";

import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeProducts } from "@/components/home/HomeProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES, CATEGORIES } from "@/lib/data";
import {
  BEST_SELLERS,
  FEATURED_PRODUCTS,
  NEW_ARRIVALS,
} from "@/lib/data/products";
import { useTranslations } from "next-intl";
import { useHomeProducts } from "@/hooks/use-home-products";
import { OrganizationSchema } from "@/components/structured-data";

export default function Home() {
  const t = useTranslations();
  const newArrivals = t("products.newArrivals");
  const featuredProducts = t("products.featuredProducts");
  const bestSellers = t("products.bestSellers");

  const { data } = useHomeProducts();

  const featured = data?.featured || [];
  const arrivals = data?.newArrivals || [];
  const sellers = data?.bestSellers || [];

  return (
    <>
      <OrganizationSchema />
      <HeroSlider slides={HERO_SLIDES} />
      <FeaturesBanner />
      <CategoryGrid categories={CATEGORIES} />

      {featured.length > 0 && (
        <HomeProducts products={featured} title={featuredProducts} />
      )}

      {arrivals.length > 0 && (
        <HomeProducts products={arrivals} title={newArrivals} />
      )}

      {sellers.length > 0 && (
        <HomeProducts products={sellers} title={bestSellers} />
      )}

      {featured.length === 0 &&
        arrivals.length === 0 &&
        sellers.length === 0 && (
          <>
            <HomeProducts
              products={FEATURED_PRODUCTS}
              title={featuredProducts}
            />
            <HomeProducts products={NEW_ARRIVALS} title={newArrivals} />
            <HomeProducts products={BEST_SELLERS} title={bestSellers} />
          </>
        )}
    </>
  );
}
