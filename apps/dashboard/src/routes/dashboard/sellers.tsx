import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useSellers } from "@/hooks/useData";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  company?: string;
  status?: "active" | "inactive" | "pending";
  totalSales?: number;
  created_at?: string;
}

const columns: ColumnDef<Seller>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      if (!status) return "-";
      const statusColors = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "totalSales",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Sales
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const salesValue = row.getValue("totalSales");
      if (!salesValue) return "-";
      const sales = parseFloat(salesValue as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(sales);
      return formatted;
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      if (!dateValue) return "-";
      const date = new Date(dateValue as string);
      return date.toLocaleDateString();
    },
  },
];

export const Route = createFileRoute("/dashboard/sellers")({
  component: SellersPage,
});

function SellersPage() {
  const { data: sellers = [], isLoading, error } = useSellers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading sellers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading sellers</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sellers</h1>
        <p className="text-muted-foreground">
          Manage seller accounts and performance
        </p>
      </div>
      <DataTable
        columns={columns}
        data={sellers}
        searchKey="name"
        searchPlaceholder="Search sellers..."
      />
    </div>
  );
}
