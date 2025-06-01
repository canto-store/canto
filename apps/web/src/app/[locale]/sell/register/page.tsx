"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { SellerForm } from "@/components/sell/SellerForm";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const t = useTranslations("sell");
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && user?.role === "SELLER") {
      router.push("/sell");
    }
  }, [user, user?.role, router]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {t("register.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          {t("register.description")}
        </p>
      </div>
      <div className="w-full">
        <SellerForm />
      </div>
    </div>
  );
}
