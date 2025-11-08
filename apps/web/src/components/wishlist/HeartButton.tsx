"use client";

import { Suspense, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetWishlist, useToggleWishlistItem } from "@/lib/wishlist";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useUserStore } from "@/stores/useUserStore";

interface HeartButtonProps {
  productId: number;
  initialActive?: boolean;
  className?: string;
}

export function HeartButton({ productId, className }: HeartButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const { mutate: toggleWishlist, isPending } = useToggleWishlistItem();
  const { data } = useGetWishlist();
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const router = useRouter();

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast("Please sign in to add items to your wishlist", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/login"),
        },
      });
      return;
    }

    toggleWishlist(productId, {
      onSuccess: (data) => {
        setIsActive(data.added);
        if (data.added) {
          toast.success("Added to wishlist");
        } else if (data.removed) {
          toast.success("Removed from wishlist");
        }
      },
    });
  };

  useEffect(() => {
    if (data) {
      const inWishlist = data.some((item) => item.id === productId);
      setIsActive(inWishlist);
    }
  }, [data, productId]);

  return (
    <Suspense fallback={<Skeleton className="h-12 w-12 md:h-10 md:w-10" />}>
      <Button
        variant="outline"
        size="icon"
        className={cn("h-12 w-12 flex-shrink-0 md:h-10 md:w-10", className)}
        disabled={isPending}
        onClick={handleToggleWishlist}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            isActive ? "fill-red-500 text-red-500" : "text-gray-600",
          )}
        />
        <span className="sr-only">
          {isActive ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      </Button>
    </Suspense>
  );
}
