import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "preact/hooks";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useUpdateProductStatus } from "@/hooks/useData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  brandId: number;
  categoryId: number;
  created_at: string;
  updated_at: string;
  brand: {
    name: string;
  };
  category: {
    name: string;
  };
}

type ProductStatusUpdate = "PENDING" | "ACTIVE" | "INACTIVE";

// Hook to delay showing loading state
function useDelayedLoading(isLoading: boolean, delay: number = 300) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true);
      }, delay);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, delay]);

  return showLoading;
}

// Map user-friendly status names to server statuses
const statusMapping = {
  Pending: "PENDING",
  Accepted: "ACTIVE",
  Rejected: "INACTIVE",
} as const;

const reverseStatusMapping = {
  PENDING: "Pending",
  ACTIVE: "Accepted",
  INACTIVE: "Rejected",
} as const;

// Status dropdown component
function StatusDropdown({
  productId,
  currentStatus,
}: {
  productId: number;
  currentStatus: ProductStatusUpdate;
}) {
  const updateStatusMutation = useUpdateProductStatus();

  const handleStatusChange = (newStatus: string) => {
    const serverStatus = statusMapping[newStatus as keyof typeof statusMapping];
    updateStatusMutation.mutate({ productId, status: serverStatus });
  };

  const currentDisplayStatus = reverseStatusMapping[currentStatus];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Accepted: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const currentColor = statusColors[currentDisplayStatus];

  return (
    <Select value={currentDisplayStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className={`w-32 ${currentColor}`}>
        <SelectValue>
          <span className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                currentDisplayStatus === "Pending"
                  ? "bg-yellow-500"
                  : currentDisplayStatus === "Accepted"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            {currentDisplayStatus}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            Pending
          </div>
        </SelectItem>
        <SelectItem value="Accepted">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Accepted
          </div>
        </SelectItem>
        <SelectItem value="Rejected">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            Rejected
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "brand.name",
    header: "Brand",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ProductStatusUpdate;
      const productId = row.original.id;
      return <StatusDropdown productId={productId} currentStatus={status} />;
    },
  },
];

export const Route = createFileRoute("/dashboard/products")({
  component: ProductsPage,
});

// Loading skeleton component
function ProductsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts();
  const showSkeleton = useDelayedLoading(isLoading);

  if (showSkeleton) {
    return <ProductsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading products</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Search products..."
      />
    </div>
  );
}
