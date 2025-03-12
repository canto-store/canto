"use client";

import { useTranslations } from "next-intl";

export default function AccountPage() {
  const t = useTranslations("account");

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Account Settings</h1>
      {/* Account content will go here */}
    </div>
  );
}
