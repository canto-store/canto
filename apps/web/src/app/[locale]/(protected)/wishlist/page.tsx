"use client";
import { useGetWishlist, useRemoveFromWishlist } from "@/lib/wishlist";
import { useState } from "react";
import { Loader2, Trash2, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type WishlistItem } from "@/types/wishlist";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function WishlistPage() {
  const { data, isLoading, isError } = useGetWishlist();
  const isMobile = useMediaQuery("(max-width: 768px)", false);

  if (isLoading) {
    return (
      <div className="from-background to-muted/20 flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-b">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 h-16 w-16 rounded-full backdrop-blur-sm"></div>
          </div>
          <Heart className="text-primary relative z-10 mx-auto h-8 w-8 animate-pulse" />
        </div>
        <h3 className="mt-6 text-xl font-medium">Loading Wishlist</h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-center">
          We&apos;re collecting all your favorite items
        </p>
        <div className="mt-4 flex gap-1">
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.4s]"></span>
          <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.6s]"></span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="to-muted/10 flex min-h-[75vh] flex-col items-center justify-center bg-gradient-to-b from-white/5 px-4">
        <div className="flex w-full max-w-lg flex-col items-center">
          <div className="mb-8 rounded-full border border-red-100 bg-red-50/80 p-6">
            <Heart className="h-10 w-10 text-red-500" />
          </div>

          <h2 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-center text-3xl font-bold text-transparent">
            Unable to Load Your Wishlist
          </h2>

          <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-red-500 to-rose-300"></div>

          <p className="text-muted-foreground mt-6 max-w-md text-center">
            We encountered an issue while retrieving your wishlist items. This
            could be due to a temporary network issue or server maintenance.
          </p>

          <Button
            onClick={() => window.location.reload()}
            size="lg"
            className="mt-8 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 px-8 shadow-md transition-all duration-300 hover:from-gray-800 hover:to-gray-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="min-h-full bg-gradient-to-b from-white to-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col items-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              My Wishlist
            </h1>
            <div className="from-primary to-primary/60 mb-16 h-1 w-20 rounded-full bg-gradient-to-r"></div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            <div className="bg-grid-gray-200/50 absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

            <div className="relative flex flex-col items-center justify-center gap-8 px-6 py-12 sm:py-16 md:px-12">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/5 ring-primary/20 mb-6 rounded-full p-4 ring-1">
                  <Heart className="text-primary h-10 w-10" />
                </div>

                <h2 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  Your Wishlist is Empty
                </h2>

                <p className="text-muted-foreground mt-4 max-w-md text-center text-gray-500">
                  Start saving your favorite products by clicking the heart
                  icon. Discover amazing products and build your collection!
                </p>
              </div>

              <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-gray-300 transition-all hover:border-gray-400 hover:bg-gray-50"
                  asChild
                >
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 hover:shadow-primary/30 rounded-full shadow-lg transition-all hover:shadow-xl"
                  asChild
                >
                  <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2"
                  >
                    Shop Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                <span className="rounded-full bg-gray-100 p-1">
                  <Heart className="h-4 w-4 text-gray-500" />
                </span>
                Click the heart icon on products to add them to your wishlist
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {!isMobile && (
          <div className="text-center">
            <h1 className="bg-clip-text text-3xl font-bold text-gray-900 sm:text-4xl">
              My Wishlist
            </h1>
            <div className="from-primary to-primary/60 mx-auto mt-3 mb-2 h-1 w-20 rounded-full bg-gradient-to-r"></div>
          </div>
        )}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all delay-200 duration-500">
          <div className="divide-y divide-gray-100 bg-white">
            {data?.map((item: WishlistItem, index: number) => (
              <div key={item.id || index}>
                <WishlistItem item={item} isLast={index === data?.length - 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WishlistItem({ item }: { item: WishlistItem; isLast?: boolean }) {
  const { mutateAsync: removeItem, isPending: removeIsPending } =
    useRemoveFromWishlist();

  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = () => {
    if (item.id) {
      removeItem(item.id).then(() =>
        toast.success("Item removed from wishlist", {
          icon: <Trash2 className="h-4 w-4 text-red-500" />,
        }),
      );
    }
  };

  return (
    <div
      className={cn(
        "group relative p-6 transition-all duration-200",
        isHovered ? "bg-gray-50" : "bg-white",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Image with hover effect */}
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md sm:h-24 sm:w-24">
          <Link href={`/product/${encodeURIComponent(item.slug || "")}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            {item.image?.url && (
              <Image
                src={item.image.url}
                alt={item.image.alt || item.name}
                fill
                className="object-contain transition-all duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 150px"
              />
            )}

            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <span className="text-xs font-medium text-white">
                View Details
              </span>
            </div>
          </Link>
        </div>

        {/* Product info */}
        <div className="min-w-0 flex-grow space-y-1">
          <Link
            href={`/product/${encodeURIComponent(item.slug || "")}`}
            className="group/title block"
          >
            <h3 className="group-hover/title:text-primary line-clamp-2 text-base font-medium text-gray-800 transition-colors sm:text-lg">
              {item.name}
            </h3>
          </Link>
          <div className="mb-1 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary rounded-md border-0 px-2.5 py-0.5 text-xs font-normal"
            >
              {item.category}
            </Badge>
            <span className="text-muted-foreground text-xs">{item.brand}</span>
          </div>

          {/* Mobile action buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-gray-100 pt-3 sm:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              disabled={removeIsPending}
              className="w-full max-w-[45%] rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus-visible:ring-red-300"
            >
              {removeIsPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Remove
            </Button>
            <Button
              variant="default"
              size="sm"
              className="hover:text-primary w-full max-w-[45%] rounded-full border-gray-200 shadow-sm hover:bg-gray-50"
              asChild
            >
              <Link href={`/product/${encodeURIComponent(item.slug || "")}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>

        {/* Desktop action buttons */}
        <div className="hidden flex-col items-center gap-3 sm:flex sm:flex-row">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemove}
              disabled={removeIsPending}
              className="h-8 w-8 rounded-full text-red-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              {removeIsPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="sr-only">Remove from wishlist</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
