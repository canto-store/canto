import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useBrands } from "@/hooks/useData";

interface Brand {
  name: string;
  slug: string | null;
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

function BrandsPage() {
  const { data: brands = [], isLoading, error } = useBrands();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading brands...</div>
      </div>
    );
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
