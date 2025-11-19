"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Product Not Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          {
            "Sorry, the product you are looking for doesn't exist or has been removed."
          }
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Shop Products</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
