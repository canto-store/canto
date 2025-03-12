"use client";

import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const t = useTranslations("checkout");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Checkout</h1>
      {/* Checkout content will go here */}
    </div>
  );
}
