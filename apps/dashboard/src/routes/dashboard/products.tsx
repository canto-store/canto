import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useProducts } from "@/hooks/useData";

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
    accessorKey: "slug",
    header: "Slug",
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
      const status = row.getValue("status") as string;
      const statusColors = {
        ACTIVE: "bg-green-100 text-green-800",
        INACTIVE: "bg-red-100 text-red-800",
        PENDING: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status as keyof typeof statusColors]
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return date.toLocaleDateString();
    },
  },
];

export const Route = createFileRoute("/dashboard/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading products...</div>
      </div>
    );
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
