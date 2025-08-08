"use client";

import Spinner from "@/components/common/Spinner";
import ProductForm from "@/components/products/ProductForm";
import { useProductById } from "@/lib/product";
import { useSearchParams } from "next/navigation";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { data: products, isSuccess, isLoading } = useProductById(productId);

  if (isLoading) return <Spinner />;

  if (isSuccess)
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold tracking-tight">
          {products ? "Edit Product" : "Create Product"}
        </h1>
        <ProductForm products={products} />
      </div>
    );
}
