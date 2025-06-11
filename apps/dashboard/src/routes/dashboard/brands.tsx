import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/useData";

interface Brand {
  name: string;
  slug: string | null;
}

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

const columns: ColumnDef<Brand>[] = [
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
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      const slug = row.getValue("slug") as string;
      return slug || "-";
    },
  },
];

export const Route = createFileRoute("/dashboard/brands")({
  component: BrandsPage,
});

// Loading skeleton component
function BrandsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandsPage() {
  const { data: brands = [], isLoading, error } = useBrands();
  const showSkeleton = useDelayedLoading(isLoading);

  if (showSkeleton) {
    return <BrandsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading brands</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brands</h1>
        <p className="text-muted-foreground">
          Manage brand information and partnerships
        </p>
      </div>
      <DataTable
        columns={columns}
        data={brands}
        searchKey="name"
        searchPlaceholder="Search brands..."
      />
    </div>
  );
}
