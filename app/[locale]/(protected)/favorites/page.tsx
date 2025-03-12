"use client";

import { useTranslations } from "next-intl";

export default function FavoritesPage() {
  const t = useTranslations("favorites");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">My Favorites</h1>
      {/* Favorites content will go here */}
    </div>
  );
}
