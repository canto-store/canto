import { useTranslations } from "next-intl";

interface BrowseHeaderProps {
  productCount: number;
}

export function BrowseHeader({ productCount }: BrowseHeaderProps) {
  const productsT = useTranslations("products");

  return (
    <div className="mb-5 flex flex-col gap-2 sm:mb-6">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {productsT("browseTitle")}
      </h1>
      <p className="text-sm text-gray-500 sm:text-base">
        {productsT("productsCount", { count: productCount })}
      </p>
    </div>
  );
}
