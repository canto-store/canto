"use client";

import React from "react";
import { useState } from "react";
import { PageShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Heart, ShoppingCart, Star } from "lucide-react";
import { ProductGrid } from "@/components/products";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  SIZES,
  COLORS,
} from "@/lib/products";
import Image from "next/image";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params);

  // Now you can safely access the slug property
  const { slug } = resolvedParams;

  // Find the product based on the slug
  const product = getProductBySlug(slug);

  // If product not found, return 404
  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = getRelatedProducts(product, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
  };

  return (
    <PageShell>
      {/* Breadcrumb and Back Button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center gap-1"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Product Detail */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 sm:aspect-[4/3] md:aspect-square lg:aspect-[4/3]">
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
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          <p className="mb-4 text-lg text-gray-600">{product.brand}</p>

          {/* Rating */}
          <div className="mb-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5"
                fill={i < 4 ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
          </div>

          <p className="mb-6 text-2xl font-bold">${product.price.toFixed(2)}</p>

          <div className="mb-6">
            <h3 className="mb-2 font-medium">Description</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget
              aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
              lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet
              nisl.
            </p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Size</h3>
              <a href="#" className="text-sm text-gray-600 hover:underline">
                Size Guide
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Color</h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  className={`h-8 w-8 rounded-full border ${
                    selectedColor === color.name
                      ? "ring-2 ring-black ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.name)}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="mb-2 font-medium">Quantity</h3>
            <div className="flex w-32 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="flex-1 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mb-6 flex gap-2">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
            >
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

          {/* Additional Info */}
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">In Stock</span>
            </div>
            <p className="text-sm text-gray-600">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <ProductGrid
        products={relatedProducts}
        title="You May Also Like"
        className="mt-16"
      />
    </PageShell>
  );
}
