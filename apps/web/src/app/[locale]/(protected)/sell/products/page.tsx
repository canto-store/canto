"use client";

import { useTranslations } from "next-intl";
import { ProductTable } from "@/components/products/table/ProductTable";
import { useMyBrand } from "@/lib/brand";
import { useProductsByBrand } from "@/lib/product";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { ProductByBrand } from "@/types";

export default function ProductPage() {
  const t = useTranslations("sell");

  const { data: brand } = useMyBrand();
  const router = useRouter();

  const { data: products, isLoading: isFetchingProducts } = useProductsByBrand(
    brand?.id ?? 0,
  );

  if (isFetchingProducts) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (products) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {t("products.title")}
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage and organize your product catalog
            </p>
          </div>

          <Button
            onClick={() => {
              router.push("/sell/product");
            }}
            className="hidden cursor-pointer sm:flex sm:w-auto"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <MobileProductView products={products} />
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <ProductTable products={products} />
          </div>
        </div>
      </div>
    );
  }
}

// Mobile-specific product view component
function MobileProductView({ products }: { products: ProductByBrand[] }) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div className="mx-auto h-16 w-16 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No products yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by adding your first product to your catalog.
        </p>
        <Button
          onClick={() => router.push("/sell/product")}
          className="mt-4"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-md object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.category}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="ml-2 flex-shrink-0">
                  <StatusBadge status={product.status} />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/sell/product?productId=${product.id}`)
                  }
                  className="w-full"
                >
                  Edit Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Status badge component for mobile
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dotColor: "bg-yellow-500",
    },
    ACTIVE: {
      label: "Accepted",
      className: "bg-green-100 text-green-800 border-green-200",
      dotColor: "bg-green-500",
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-gray-100 text-gray-800 border-gray-200",
      dotColor: "bg-gray-500",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border-red-200",
      dotColor: "bg-red-500",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${config.className}`}
    >
      <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
