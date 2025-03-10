"use client";

import Image from "next/image";
import { siInstagram, siX, siFacebook, siYoutube } from "simple-icons";

const footerNavigation = {
  shop: [
    { label: "New Arrivals", href: "#" },
    { label: "Best Sellers", href: "#" },
    { label: "Collections", href: "#" },
    { label: "Sale", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Sustainability", href: "#" },
  ],
  support: [
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Shipping & Returns", href: "#" },
    { label: "Size Guide", href: "#" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

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
  return (
    <footer className="bg-light-blue border-t">
      <div className="text-burgundy container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Navigation Links */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-medium tracking-wider uppercase">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerNavigation.shop.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-medium tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-primarytransition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-medium tracking-wider uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              {footerNavigation.support.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-medium tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-burgundy mt-12 border-t-2 pt-8">
          <div className="flex flex-col items-center gap-1 md:flex-row">
            <p>
              Copyright © {new Date().getFullYear()} Canto Store. All Rights
              Reserved.
            </p>
            <a href="#" className="underline">
              Terms of Use
            </a>
            <a href="#" className="underline">
              Privacy Policy
            </a>
            <Image
              src="/yellowBurgundyLogo.svg"
              className="bg-none"
              alt="Canto Store Logo"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
