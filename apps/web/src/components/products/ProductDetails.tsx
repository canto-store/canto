"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart } from "lucide-react";
import { ProductDetails as ProductDetailsType, ProductVariant } from "@/types";
import ProductOptions from "./ProductOptions";
import { Link } from "@/i18n/navigation";
import { useAddToCart } from "@/lib/cart";

import { HeartButton } from "../wishlist/HeartButton";
import { toast } from "sonner";
import ProductQuantitySelector from "./ProductQuantitySelector";
import ProductRating from "./ProductRating";
import { CarouselApi } from "../ui/carousel";
import ProductImages from "./ProductImages";
interface ProductDetailsProps {
  product: ProductDetailsType;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);

  const [api, setApi] = useState<CarouselApi | null>(null);
  const showImage = (matchingVariant: ProductVariant) => {
    if (!api) return;

    if (matchingVariant.images.length > 0) {
      const firstImageUrl = matchingVariant.images[0].url;

      const imageIndex = product.variants
        .flatMap((variant) => variant.images)
        .findIndex((img) => img.url === firstImageUrl);

      if (imageIndex >= 0) {
        api.scrollTo(imageIndex);
      }
    }
  };

  const { mutateAsync: addToCart } = useAddToCart();

  useEffect(() => {
    if (product.default_variant_id) {
      const defaultVariant = product.variants.find(
        (v) => v.id === product.default_variant_id,
      );
      setSelectedVariant(defaultVariant);
      setStock(defaultVariant ? defaultVariant.stock : 0);
    } else {
      setStock(product.total_stock);
      if (product.total_stock === 0) {
        setQuantity(0);
      }
    }
  }, [product]);

  const onVariantChange = (variant: ProductVariant | undefined) => {
    setSelectedVariant(variant);
    if (variant) {
      setStock(variant.stock);
    } else {
      setStock(product.total_stock);
    }
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    addToCart({
      variantId: selectedVariant.id,
      quantity,
    }).then((res) => {
      if (res.status === 201) {
        toast.success("Added to cart");
      }
    });
  };

  return (
    <div className="grid items-center gap-4 md:grid-cols-2 md:gap-8">
      <ProductImages product={product} setApi={setApi} />
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold md:text-3xl">{product.name}</h1>
        <Link
          href={`/browse?brand=${product.brand.slug}`}
          className="text-base text-gray-600 md:text-lg"
        >
          {product.brand.name}
        </Link>

        <ProductRating
          rating={product.reviews.rating}
          reviewCount={product.reviews.count}
        />

        <p className="text-xl font-bold md:text-2xl">
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

        <h3 className="font-medium">Description</h3>
        <p className="text-sm text-gray-600">{product.description}</p>

        <ProductOptions
          variants={product.variants}
          onVariantChange={onVariantChange}
          showImage={showImage}
        />
        <ProductQuantitySelector
          quantity={quantity}
          stock={stock}
          onQuantityChange={setQuantity}
        />

        {/* Add to Cart - Desktop only */}
        <div className="hidden gap-2 md:flex">
          {stock > 0 ? (
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
