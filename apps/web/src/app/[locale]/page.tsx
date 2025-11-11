"use client";

import { HomeProducts } from "@/components/home/HomeProducts";
// import { FeaturesBanner } from "@/components/home/FeaturesBanner";
import { HomeCategories } from "@/components/home/HomeCategories";
import { useHomeProducts } from "@/lib/product";
import { useEffect } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetCart } from "@/lib/cart";
import banner from "../../../public/banner.png";
import bannerMobile from "../../../public/mobile-banner.png";
import { HomeCategoriesBanner } from "@/components/home/HomeCategoriesBanner";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Accordion,
  AccordionItem,
} from "@heroui/react";

export default function Home() {
  const { data, isLoading } = useHomeProducts();
  const { bestDeals, bestSellers, newArrivals } = data || {};
  const t = useTranslations();
  useGetCart();

  useEffect(() => {
    // Ensure we start at the top when landing on the home page (including back navigation)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <>
      <Accordion>
        <AccordionItem key="1" aria-label="Accordion 1" title="Accordion 1">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
          {defaultContent}
        </AccordionItem>
        <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
          {defaultContent}
        </AccordionItem>
      </Accordion>

      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Open Menu</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="new">New file</DropdownItem>
          <DropdownItem key="copy">Copy link</DropdownItem>
          <DropdownItem key="edit">Edit file</DropdownItem>
          <DropdownItem key="delete" className="text-danger" color="danger">
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <HomeCategoriesBanner />

      <section className="relative right-[50%] left-[50%] -mx-[50vw] h-[calc(100vh-6.5rem-5rem)] w-screen max-w-none sm:hidden">
        {/* 👇 Shown only on screens smaller than 640px */}
        <Image
          src={bannerMobile}
          alt="Hero Mobile"
          fill
          className="object-fill"
          priority
        />
      </section>
      <section className="relative right-[50%] left-[50%] -mx-[50vw] hidden h-[calc(100vh-6.5rem-5rem)] w-screen max-w-none min-sm:block md:hidden">
        {/* 👇 Shown only on screens between 640px and 768px */}

        <Image
          src={banner}
          alt="Hero Tablet"
          fill
          className="object-cover"
          priority
        />
      </section>
      <section className="relative right-[50%] left-[50%] -mx-[50vw] hidden h-[calc(100vh-6.5rem-5rem)] w-screen max-w-none md:block">
        {/* 👇 Shown only on screens larger than 768px */}
        <Image
          src={banner}
          alt="Hero Desktop"
          fill
          className="object-fill"
          priority
        />
      </section>
      <HomeProducts
        products={bestDeals}
        title="Canto's Deals"
        isLoading={isLoading}
      />
      <HomeCategories />
      <HomeProducts
        products={bestSellers}
        title="Best Sellers"
        isLoading={isLoading}
      />
      <HomeProducts
        products={newArrivals}
        title="New Arrivals"
        isLoading={isLoading}
      />
      {/* <FeaturesBanner /> */}
      <section>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center sm:px-6 lg:px-8">
          <RotateCcw className="mb-3 h-8 w-8 text-gray-500 sm:mb-4" />
          <h3 className="text-xs font-medium text-gray-500 uppercase sm:text-sm">
            {t("features.return.title")}
          </h3>
          <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
            {t("features.return.description")}
          </p>
        </div>
      </section>
    </>
  );
}
