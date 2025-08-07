import { useTranslations } from "next-intl";
import { BrandForm } from "@/components/sell/BrandForm";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import Spinner from "../common/Spinner";
export default function BrandPage() {
  const t = useTranslations("sell");

  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  if (!isLoading && isAuthenticated)
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("brand.title")}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{t("brand.description")}</p>
        </div>
        <div className="w-full">
          <BrandForm />
        </div>
      </div>
    );
  return <Spinner />;
}
