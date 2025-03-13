import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCart } from "@/providers";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations();
  const productsT = useTranslations("products");
  const router = useRouter();
  const params = useParams();
  const isRTL = params.locale === "ar";

  const { addToCart } = useCart();
  // Get translated product name and brand if translation keys are available
  const productName = product.translationKey?.name
    ? t(product.translationKey.name)
    : product.name;

  const brandName = product.translationKey?.brand
    ? t(product.translationKey.brand)
    : product.brand;

  // Format price with proper currency symbol and localization
  const formatPrice = (price: number): string => {
    // Instead of using string replacement, pass the amount as a parameter to the translation function
    return productsT("currency.format", { amount: price.toFixed(2) });
  };

  const handleProductClick = (product: Product) => {
    router.push(
      `/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`,
    );
  };

  const handleBrandClick = (product: Product) => {
    router.push(`/browse?brand=${encodeURIComponent(product.brand)}`);
  };

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-lg text-sm shadow-md transition-shadow duration-300 hover:shadow-lg sm:text-base"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <button
          onClick={() => handleProductClick(product)}
          className="h-full w-full hover:cursor-pointer"
        >
          <Image
            src={product.image}
            alt={productName}
            className="h-full w-full transform object-cover transition-transform duration-300 group-hover:scale-105"
            width={600}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, 500px"
            priority={true}
            quality={90}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <button
            onClick={() => handleProductClick(product)}
            className="w-full hover:cursor-pointer"
          >
            <h3
              className={cn(
                "line-clamp-2 min-h-[40px] text-base font-semibold sm:min-h-[48px] sm:text-lg",
                isRTL ? "text-right" : "text-left",
              )}
            >
              {productName}
            </h3>
          </button>
          <button
            onClick={() => handleBrandClick(product)}
            className={cn(
              "mb-3 line-clamp-1 w-full text-xs text-gray-600 hover:cursor-pointer sm:text-sm",
              isRTL ? "text-right" : "text-left",
            )}
          >
            <p>{brandName}</p>
          </button>
        </div>
        <div>
          <div
            className={cn(
              "flex items-center justify-between",
              isRTL && "flex-row-reverse",
            )}
          >
            <span className="text-lg font-bold sm:text-xl">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className={cn("mt-4 flex gap-3", isRTL && "flex-row-reverse")}>
            <Button
              onClick={() => addToCart(product)}
              size="default"
              className="flex-1 gap-2 py-2 text-sm sm:py-2.5 sm:text-base"
            >
              <ShoppingCart
                className={cn("h-4 w-4 sm:h-5 sm:w-5", isRTL && "mr-0 ml-1")}
              />
              {productsT("add")}
            </Button>
            <Button
              variant="outline"
              size="default"
              className="flex-1 gap-2 py-2 text-sm sm:py-2.5 sm:text-base"
              asChild
              onClick={() => handleProductClick(product)}
            >
              <div
                className={cn(
                  "flex items-center justify-center",
                  isRTL && "flex-row-reverse",
                )}
              >
                <Eye
                  className={cn("h-4 w-4 sm:h-5 sm:w-5", isRTL && "mr-0 ml-1")}
                />
                {productsT("view")}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
