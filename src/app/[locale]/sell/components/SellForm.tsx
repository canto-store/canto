"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

export function SellForm() {
  const t = useTranslations();
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
          <FormInput
            id="firstName"
            name="firstName"
            label={t("sell.firstName")}
            required
            placeholder={t("sell.firstNamePlaceholder")}
            customErrorMessage={t("form.fieldRequired")}
          />

          <FormInput
            id="lastName"
            name="lastName"
            label={t("sell.lastName")}
            required
            placeholder={t("sell.lastNamePlaceholder")}
            customErrorMessage={t("form.fieldRequired")}
          />
        </div>

        <FormInput
          id="email"
          name="email"
          label={t("sell.email")}
          type="email"
          required
          placeholder={t("sell.emailPlaceholder")}
          customErrorMessage={t("form.fieldRequired")}
        />

        <FormInput
          id="phone"
          name="phone"
          label={t("sell.phone")}
          type="tel"
          required
          placeholder={t("sell.phonePlaceholder")}
          customErrorMessage={t("form.fieldRequired")}
        />

        <FormInput
          id="storeName"
          name="storeName"
          label={t("sell.storeName")}
          required
          placeholder={t("sell.storeNamePlaceholder")}
          customErrorMessage={t("form.fieldRequired")}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">{t("sell.agreement")}</p>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("sell.submitting") : t("sell.submit")}
        </Button>
      </div>
    </form>
  );
}
