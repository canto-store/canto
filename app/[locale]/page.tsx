"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HomeProducts } from "@/components/home/HomeProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES } from "@/lib/data/hero-slides";
import { CATEGORIES } from "@/lib/data/categories";
import { BEST_SELLERS, FEATURED_PRODUCTS, NEW_ARRIVALS } from "@/lib/products";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const newArrivals = t("products.newArrivals");
  const featuredProducts = t("products.featuredProducts");
  const bestSellers = t("products.bestSellers");
  return (
    <PageLayout>
      <HeroSlider slides={HERO_SLIDES} />
      <CategoryGrid categories={CATEGORIES} />
      <HomeProducts products={FEATURED_PRODUCTS} title={featuredProducts} />
      <HomeProducts products={NEW_ARRIVALS} title={newArrivals} />
      <HomeProducts products={BEST_SELLERS} title={bestSellers} />
      <FeaturesBanner />
    </PageLayout>
  );
}
