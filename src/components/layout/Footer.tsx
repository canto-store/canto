"use client";

import { siInstagram, siX, siFacebook, siYoutube } from "simple-icons";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import Image from "next/image";

type TranslationFunction = (key: string) => string;

const footerNavigation = (t: TranslationFunction) => ({
  shop: [
    { label: t("footer.newArrivals"), href: "#" },
    { label: t("footer.bestSellers"), href: "#" },
    { label: t("footer.collections"), href: "#" },
    { label: t("footer.sale"), href: "#" },
  ],
  company: [
    { label: t("footer.aboutUs"), href: "#" },
    { label: t("footer.careers"), href: "#" },
    { label: t("footer.press"), href: "#" },
    { label: t("footer.sustainability"), href: "#" },
  ],
  support: [
    { label: t("footer.contactUs"), href: "#" },
    { label: t("footer.faqs"), href: "#" },
    { label: t("footer.shippingReturns"), href: "#" },
    { label: t("footer.sizeGuide"), href: "#" },
  ],
});

const socialLinks = [
  {
    icon: siInstagram,
    href: "#",
    label: "Instagram",
    color: "#E4405F",
  },
  {
    icon: siX,
    href: "#",
    label: "X (Twitter)",
    color: "#000000",
  },
  {
    icon: siFacebook,
    href: "#",
    label: "Facebook",
    color: "#1877F2",
  },
  {
    icon: siYoutube,
    href: "#",
    label: "YouTube",
    color: "#FF0000",
  },
];

export function Footer() {
  const t = useTranslations();
  const navigation = footerNavigation(t);

  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Canto"
                className="h-8 w-auto"
                width={32}
                height={32}
              />
              <span className="ml-2 text-xl font-bold">Canto</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              {t("footer.subscribeText")}
            </p>
            <form className="mt-4 flex max-w-md flex-col sm:flex-row">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="h-10 rounded-md border border-gray-300 px-4 focus:border-black focus:outline-none sm:max-w-xs"
                required
              />
              <Button type="submit" className="mt-2 sm:mt-0 sm:ml-2">
                {t("footer.subscribe")}
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
              {t("footer.shop")}
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.shop.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
              {t("footer.company")}
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-900 uppercase">
                {t("footer.support")}
              </h3>
              <ul className="mt-4 space-y-2">
                {navigation.support.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-500">{t("footer.copyright")}</p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <h3 className="sr-only">{t("footer.followUs")}</h3>
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                  aria-label={item.label}
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-current"
                    style={{ color: item.color }}
                  >
                    <title>{item.label}</title>
                    <path d={item.icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
