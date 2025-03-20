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
import { OrganizationSchema } from "@/components/structured-data";

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <HeroSlider slides={HERO_SLIDES} />
      <FeaturesBanner />

      <HomeProducts products={FEATURED_PRODUCTS} title="Best Deals" />

      <CategoryGrid categories={CATEGORIES} />

      <HomeProducts products={BEST_SELLERS} title="Best Sellers" />

      <HomeProducts products={NEW_ARRIVALS} title="New Arrivals" />
    </>
  );
}
