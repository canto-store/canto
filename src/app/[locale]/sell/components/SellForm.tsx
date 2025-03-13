"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SellForm() {
  const t = useTranslations("sell");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // const formData = new FormData(e.currentTarget);
      // TODO: Implement API call to register seller
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/seller");
    } catch (error) {
      console.error("Error registering seller:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t("firstName")}</Label>
            <Input
              id="firstName"
              name="firstName"
              required
              className="mt-1"
              placeholder={t("firstNamePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t("lastName")}</Label>
            <Input
              id="lastName"
              name="lastName"
              required
              className="mt-1"
              placeholder={t("lastNamePlaceholder")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            className="mt-1"
            placeholder={t("phonePlaceholder")}
          />
        </div>

        <div>
          <Label htmlFor="storeName">{t("storeName")}</Label>
          <Input
            id="storeName"
            name="storeName"
            required
            className="mt-1"
            placeholder={t("storeNamePlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">{t("agreement")}</p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
