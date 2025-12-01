import { useGetCart } from "@/lib/cart";
import React from "react";
import Image from "next/image";

export const CartIcon: React.FC = () => {
  const { data } = useGetCart();
  return (
    <span className="inline-block">
      <Image src="/cart.png" alt="cart" width={32} height={32} />
      {data && data.count > 0 && (
        <span className="bg-primary text-secondary-foreground absolute top-3 right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shadow">
          {data.count}
        </span>
      )}
    </span>
  );
};
