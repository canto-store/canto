"use client";

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
    <footer className="bg-gray-100 pt-16 text-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Shop Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase">
              Shop
            </h3>
            <ul className="space-y-2">
              {footerNavigation.shop.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase">
              Support
            </h3>
            <ul className="space-y-2">
              {footerNavigation.support.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerNavigation.legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors hover:text-black"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="mb-4 text-sm font-bold tracking-wider uppercase">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 flex flex-wrap items-center justify-between border-t border-gray-200 py-8">
          <div className="mb-4 flex w-full justify-center space-x-6 md:mb-0 md:w-auto">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-gray-600 transition-colors hover:text-black"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 fill-current"
                >
                  <title>{social.label}</title>
                  <path d={social.icon.path} />
                </svg>
              </a>
            ))}
          </div>
          <div className="w-full text-center md:w-auto">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} CANTO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
