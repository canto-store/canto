import { useGetCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import React from "react";

export const CartIcon: React.FC = () => {
  const { data } = useGetCart();
  return (
    <span className="inline-block">
      <ShoppingCart className="h-5 w-5" />
      {data && data.count > 0 && (
        <span className="bg-primary text-secondary-foreground absolute top-3 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow">
          {data.count}
        </span>
      )}
    </span>
  );
};
