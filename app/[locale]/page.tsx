"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HERO_SLIDES } from "@/lib/data/hero-slides";
import { CATEGORIES } from "@/lib/data/categories";
import { FEATURED_PRODUCTS } from "@/lib/data/featured-products";
import { useTranslations } from "next-intl";

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const t = useTranslations();

  const handleQuickAdd = (productName: string) => {
    setCartCount((prev) => prev + 1);
    toast(t("products.addedToCart", { productName }), {
      description: t("cart.viewCart"),
    });
  };

  return (
    <PageLayout cartCount={cartCount}>
      <HeroSlider slides={HERO_SLIDES} />
      <CategoryGrid categories={CATEGORIES} />
      <FeaturedProducts
        products={FEATURED_PRODUCTS}
        onAddToCart={handleQuickAdd}
      />
      <FeaturesBanner />
    </PageLayout>
  );
}
