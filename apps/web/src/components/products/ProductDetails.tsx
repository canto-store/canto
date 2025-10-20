"use client";

import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { ProductDetails as ProductDetailsType, ProductVariant } from "@/types";
import ProductOptions from "./ProductOptions";
import { Link } from "@/i18n/navigation";
import { useAddToCart } from "@/lib/cart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuthStore } from "@/stores/auth-store";
import { HeartButton } from "../wishlist/HeartButton";
import { toast } from "sonner";
interface ProductDetailsProps {
  product: ProductDetailsType;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);

  const { mutateAsync: addToCart } = useAddToCart();
  const { user } = useAuthStore();

  useEffect(() => {
    if (product.default_variant_id) {
      const defaultVariant = product.variants.find(
        (v) => v.id === product.default_variant_id,
      );
      setSelectedVariant(defaultVariant);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    if (user) {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
      });
    } else {
      toast("Please login to add items to your cart");
    }
  };

  const images = useMemo(() => {
    return product.variants.flatMap((variant) =>
      variant.images.map((image) => ({
        url: image.url,
        alt: image.alt_text || product.name,
      })),
    );
  }, [product.variants, product.name]);

  return (
    <div className="mt-3 grid flex-1 items-center gap-4 md:grid-cols-2 md:gap-8">
      <div className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.url} className="basis-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white/90" />
              <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white/90" />
            </>
          )}
        </Carousel>
      </div>

      {/* Product Info */}
      <div>
        <h1 className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">
          {product.name}
        </h1>
        <Link
          href={`/browse?brand=${product.brand.slug}`}
          className="mb-2 text-base text-gray-600 md:mb-4 md:text-lg"
        >
          {product.brand.name}
        </Link>

        <ProductRating
          rating={product.reviews.rating}
          reviewCount={product.reviews.count}
        />

        <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">
          {selectedVariant ? (
            <>
              {selectedVariant.original_price &&
              selectedVariant.discount_percentage ? (
                <>
                  <span className="text-green-600">
                    {selectedVariant.price_formatted}
                  </span>
                  <span className="ml-2 text-sm font-normal text-gray-500 line-through">
                    {selectedVariant.original_price_formatted}
                  </span>
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({selectedVariant.discount_percentage}% off)
                  </span>
                </>
              ) : (
                selectedVariant.price_formatted
              )}
            </>
          ) : (
            <>
              {product.price_range.min_price}
              {product.price_range.max_price >
                product.price_range.min_price && (
                <span> - {product.price_range.max_price}</span>
              )}
            </>
          )}
        </p>

        <ProductDescription description={product.description} />
        <ProductOptions
          variants={product.variants}
          onVariantChange={setSelectedVariant}
        />
        <div className="mb mb-4 grid grid-cols-2 grid-rows-2 gap-4 md:mb-6">
          <ProductQuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
          {/* <ProductAvailability
            isInStock={product.variants.some((v) => v.stock > 0)}
          /> */}
        </div>

        {/* Add to Cart - Desktop only */}
        <div className="mb-6 hidden gap-2 md:flex">
          {product.variants.some((v) => v.stock > 0) ? (
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </Button>
          ) : (
            <Button size="lg" className="flex-1 gap-2" variant="outline">
              <Bell className="h-5 w-5" />
              <span>Notify Me</span>
            </Button>
          )}
          <HeartButton productId={product.id} />
        </div>
      </div>

      {/* Floating Add to Cart - Mobile only */}
      <div className="bg-global fixed right-0 bottom-0 left-0 z-50 flex gap-2 border-t border-gray-200 p-4 shadow-lg md:hidden">
        <HeartButton productId={product.id} />
        <Button
          disabled={!selectedVariant || selectedVariant.stock === 0}
          size="lg"
          className="h-12 flex-1 gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

// Subcomponents
function ProductRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="mb-2 flex items-center gap-1 md:mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 md:h-5 md:w-5"
          fill={i < rating ? "currentColor" : "none"}
        />
      ))}
      <span className="ml-2 text-xs text-gray-600 md:text-sm">
        ({reviewCount} reviews)
      </span>
    </div>
  );
}

function ProductDescription({ description }: { description: string }) {
  return (
    <div className="mb-4 md:mb-6">
      <h3 className="mb-1 font-medium md:mb-2">Description</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function ProductQuantitySelector({
  quantity,
  onQuantityChange,
}: {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-medium md:mb-2">Quantity</h3>
      <div className="flex w-24 items-center md:w-32">
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="flex-1 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </Button>
      </div>
    </div>
  );
}

// function ProductAvailability({ isInStock }: { isInStock: boolean }) {
//   return isInStock ? (
//     <div className="rounded-lg border p-3 md:p-4">
//       <div className="mb-1 flex items-center gap-2 md:mb-2">
//         <div className="h-2 w-2 rounded-full bg-green-500" />
//         <span className="text-xs font-medium md:text-sm">In Stock</span>
//       </div>
//       <p className="text-xs text-gray-600 md:text-sm">
//         Free shipping on orders over $50
//       </p>
//     </div>
//   ) : (
//     <div className="rounded-lg border p-3 md:p-4">
//       <div className="mb-1 flex items-center gap-2 md:mb-2">
//         <div className="h-2 w-2 rounded-full bg-red-500" />
//         <span className="text-xs font-medium md:text-sm">Out of stock</span>
//       </div>
//       <p className="text-xs text-gray-600 md:text-sm">
//         Sorry this product is currently out of stock. Please check back later.
//       </p>
//     </div>
//   );
// }
