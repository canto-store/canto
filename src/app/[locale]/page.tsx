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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HOME_PRODUCTS_URL } from "@/lib/config";
import { Product } from "@/types";

export default function Home() {
  interface HomeProductsResponse {
    best_deal: Product[];
    best_seller: Product[];
    new_arrival: Product[];
    products: Product[];
    sections: Record<string, unknown>[];
  }

  const { data: home_products } = useQuery<HomeProductsResponse, Error>({
    queryKey: ["home_products"],
    queryFn: async () => {
      return axios
        .get<HomeProductsResponse>(HOME_PRODUCTS_URL)
        .then((res) => res.data)
        .catch((error) => {
          throw new Error(
            error.response?.data?.message ?? "Failed to fetch data",
          );
        });
    },
  });

  console.log(home_products);
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
