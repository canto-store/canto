"use client";

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
import { useCart } from "@/components/cart";

export default function Home() {
  const t = useTranslations();
  const { addItem } = useCart();

  const handleQuickAdd = (productName: string) => {
    // Find the product in FEATURED_PRODUCTS
    const product = FEATURED_PRODUCTS.find((p) => p.name === productName);

    if (product) {
      // Add the product to the cart
      addItem(product, 1);

      // Show a toast notification
      toast(t("products.addedToCart", { productName }), {
        description: t("cart.viewCart"),
      });
    }
  };

  return (
    <PageLayout>
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
