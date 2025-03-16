import { Metadata } from "next";
import { SellForm } from "./components/SellForm";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Become a Seller on Canto",
  description:
    "Join our marketplace and start selling your products to customers easily",
};

export default function SellPage() {
  const t = useTranslations("sell");

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-4 text-lg text-gray-600">{t("description")}</p>
        </div>
        <SellForm />
      </div>
    </>
  );
}
