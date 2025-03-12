"use client";

import { useTranslations } from "next-intl";
import { Truck, RotateCcw, Headset, Mail } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeaturesBanner() {
  const t = useTranslations();

  const features: FeatureItem[] = [
    {
      icon: <Truck className="h-8 w-8 text-gray-500" />,
      title: t("features.payment.title", {
        defaultValue: "PAYMENT & DELIVERY",
      }),
      description: t("features.payment.description", {
        defaultValue: "Free shipping for orders over $50",
      }),
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-gray-500" />,
      title: t("features.return.title", { defaultValue: "RETURN & REFUND" }),
      description: t("features.return.description", {
        defaultValue: "Free 100% money back guarantee",
      }),
    },
    {
      icon: <Headset className="h-8 w-8 text-gray-500" />,
      title: t("features.support.title", { defaultValue: "QUALITY SUPPORT" }),
      description: t("features.support.description", {
        defaultValue: "Always online feedback 24/7",
      }),
    },
    {
      icon: <Mail className="h-8 w-8 text-gray-500" />,
      title: t("features.newsletter.title", {
        defaultValue: "JOIN OUR NEWSLETTER",
      }),
      description: t("features.newsletter.description", {
        defaultValue: "10% off by subscribing to our newsletter",
      }),
    },
  ];

  return (
    <section className="border-t border-gray-200 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-3 sm:mb-4">{feature.icon}</div>
              <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase sm:text-sm">
                {feature.title}
              </h3>
              <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
