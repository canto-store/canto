import { useCartStore } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";
import React from "react";

export const CartIcon: React.FC = () => {
  const { count } = useCartStore();
  return (
    <span className="inline-block">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="bg-primary text-secondary-foreground absolute top-3 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow">
          {count}
        </span>
      )}
    </span>
  );
};
