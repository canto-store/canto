import Image from "next/image";
import { Return } from "@/types/return";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatPrice } from "@/lib/utils";

type ReturnCardProps = {
  returnItem: Return;
};

export function ReturnCard({ returnItem }: ReturnCardProps) {
  return (
    <div className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-row items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize",
            returnItem.status === "PENDING" && "bg-amber-100 text-amber-800",
            returnItem.status === "REFUNDED" && "bg-blue-100 text-blue-800",
            returnItem.status === "REJECTED" && "bg-red-100 text-red-800",
          )}
        >
          {returnItem.status.split("_").join(" ").toLowerCase()}
        </span>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(returnItem.createdAt)}
        </p>
      </div>

      <Separator className="my-3" />

      <div className="mt-2 flex flex-wrap gap-2">
        <div
          key={returnItem.id}
          className="relative h-14 w-14 overflow-hidden rounded-md"
        >
          <Image
            src={
              returnItem.orderItem.variant?.product.image || "/placeholder.png"
            }
            alt={returnItem.orderItem.variant?.product.name || "Product Image"}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-4 flex">
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {formatPrice(returnItem.orderItem.priceAtOrder)}
          </p>
        </div>
      </div>
    </div>
  );
}
