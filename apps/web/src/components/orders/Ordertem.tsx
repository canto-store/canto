"use client";

import { useLocale } from "next-intl";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { useCreateReturn } from "@/lib/return";

interface OrderItemProps {
  item: any;
  canReturn: boolean;
}

export function OrderItemComponent({ item, canReturn }: OrderItemProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { mutateAsync: returnItem } = useCreateReturn();

  const handleReturnItem = async () => {
    await returnItem({ orderItemId: item.id, reason: "No longer needed" });
  };

  return (
    <div className="flex flex-col py-2 sm:flex-row sm:py-3">
      {/* Product Image */}
      <div className="mx-auto mb-2 h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:mx-0 sm:mb-0 sm:h-20 sm:w-20">
        <Image
          src={item.variant.images?.[0]?.url || item.variant.product.image}
          alt={item.variant.product.name}
          width={80}
          height={80}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Product Details */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isRTL ? "mr-0 sm:mr-6" : "ml-0 sm:ml-6",
        )}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <h3 className="text-sm font-medium text-gray-900 sm:text-base">
            {item.variant.product.name}
          </h3>
          <p className="text-primary mt-1 text-sm font-medium sm:mt-0 sm:text-left">
            {formatPrice(item.priceAtOrder * item.quantity)}
          </p>
        </div>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {item.variant.product.brand.name}
        </p>
        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          {/* Options section */}
          {item.variant.optionLinks?.length > 0 && (
            <div className="my-2 flex flex-wrap gap-4">
              {item.variant.optionLinks.map((link: any) => (
                <div key={link.productOption.id}>
                  <h3 className="font-medium text-gray-900">
                    {link.productOption.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="focus-visible:border-ring focus-visible:ring-ring/50 bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-auto shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50">
                      {link.optionValue.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {canReturn &&
            item.returns.length === 0 &&
            new Date(item.returnDeadline) > new Date() && (
              <Button onClick={handleReturnItem} variant="destructive">
                Return Item
              </Button>
            )}
          {item.returns.length > 0 && (
            <p>Return Requested on {formatDate(item.returns[0].createdAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
