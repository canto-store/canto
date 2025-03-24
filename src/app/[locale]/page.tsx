"use client";

import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProducts } from "@/components/home/HomeProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES } from "@/lib/data";
import {
  BEST_SELLERS,
  FEATURED_PRODUCTS,
  NEW_ARRIVALS,
} from "@/lib/data/products";
import { OrganizationSchema } from "@/components/structured-data";
import { HomeCategories } from "@/components/home/HomeCategories";

export default function Home() {
  return (
    <>
      <OrganizationSchema />
      <HeroSlider slides={HERO_SLIDES} />
      <FeaturesBanner />

      <HomeProducts products={FEATURED_PRODUCTS} title="Best Deals" />

      <HomeCategories />

      <HomeProducts products={BEST_SELLERS} title="Best Sellers" />

      <HomeProducts products={NEW_ARRIVALS} title="New Arrivals" />
    </>
  );
}
