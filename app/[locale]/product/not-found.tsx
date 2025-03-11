"use client";

import { PageShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductsNotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
        <p className="mb-8 text-lg text-gray-600">
          {
            "Sorry, the page you are looking for doesn't exist or has been moved."
          }
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/browse">Browse Products</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
