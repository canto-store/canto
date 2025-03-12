"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { SIZES, COLORS } from "@/lib/data";
import Image from "next/image";

interface Product {
  name: string;
  brand: string;
  price: number;
  image: string;
}

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // TODO: Implement cart functionality
  };

  return (
    <div className="h-main mt-7 grid items-center gap-4 md:mt-0 md:grid-cols-2 md:gap-8">
      {/* Product Image */}
      <div className="relative aspect-[4/3] rounded-lg bg-gray-100 md:aspect-square lg:aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain object-center"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 33vw"
          priority
          quality={90}
        />
      </div>

      {/* Product Info */}
      <div>
        <h1 className="mb-1 text-2xl font-bold md:mb-2 md:text-3xl">
          {product.name}
        </h1>
        <p className="mb-2 text-base text-gray-600 md:mb-4 md:text-lg">
          {product.brand}
        </p>

        <ProductRating rating={4} reviewCount={24} />

        <p className="mb-3 text-xl font-bold md:mb-6 md:text-2xl">
          ${product.price.toFixed(2)}
        </p>

        <ProductDescription />

        <div className="mb mb-4 grid grid-cols-2 grid-rows-2 gap-4 md:mb-6">
          <ProductSizeSelector
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          <ProductColorSelector
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />

          <ProductQuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
          />

          <ProductAvailability />
        </div>

        {/* Add to Cart - Desktop only */}
        <div className="mb-6 hidden gap-2 md:flex">
          <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </div>

      {/* Floating Add to Cart - Mobile only */}
      <div className="fixed right-0 bottom-0 left-0 z-50 flex gap-2 border-t border-gray-200 bg-white p-4 shadow-lg md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 flex-shrink-0"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart
            className="h-5 w-5"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </Button>
        <Button
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

function ProductDescription() {
  return (
    <div className="mb-4 md:mb-6">
      <h3 className="mb-1 font-medium md:mb-2">Description</h3>
      <p className="text-sm text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
        nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl
        nisl sit amet nisl.
      </p>
    </div>
  );
}

function ProductSizeSelector({
  selectedSize,
  onSelectSize,
}: {
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="mb-1 font-medium md:mb-2">Size</h3>
      </div>
      <div className="flex flex-wrap gap-1 md:gap-2">
        {SIZES.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            className="h-auto px-2 py-1 text-xs md:h-9 md:text-sm"
            onClick={() => onSelectSize(size)}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ProductColorSelector({
  selectedColor,
  onSelectColor,
}: {
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-1 font-medium md:mb-2">Color</h3>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {COLORS.map((color) => (
          <button
            key={color.name}
            className={`h-6 w-6 rounded-full border md:h-8 md:w-8 ${
              selectedColor === color.name
                ? "ring-2 ring-black ring-offset-1 md:ring-offset-2"
                : ""
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => onSelectColor(color.name)}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
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

function ProductAvailability() {
  return (
    <div className="rounded-lg border p-3 md:p-4">
      <div className="mb-1 flex items-center gap-2 md:mb-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium md:text-sm">In Stock</span>
      </div>
      <p className="text-xs text-gray-600 md:text-sm">
        Free shipping on orders over $50
      </p>
    </div>
  );
}
