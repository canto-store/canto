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
import { AppLayout } from "@/components/layout";

export default function Home() {
  const t = useTranslations();
  const newArrivals = t("products.newArrivals");
  const featuredProducts = t("products.featuredProducts");
  const bestSellers = t("products.bestSellers");
  return (
    <AppLayout theme="custom">
      <HeroSlider slides={HERO_SLIDES} />
      <FeaturesBanner />
      <CategoryGrid categories={CATEGORIES} />
      <HomeProducts products={FEATURED_PRODUCTS} title={featuredProducts} />
      <HomeProducts products={NEW_ARRIVALS} title={newArrivals} />
      <HomeProducts products={BEST_SELLERS} title={bestSellers} />
    </AppLayout>
  );
}
