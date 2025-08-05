import { Button } from "@/components/ui/button";
import { ProductByBrand } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit } from "lucide-react";

type ProductStatusUpdate = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";

const reverseStatusMapping = {
  PENDING: "Pending",
  ACTIVE: "Accepted",
  INACTIVE: "Inactive",
  REJECTED: "Rejected",
} as const;

// Status display component
function StatusDisplay({ status }: { status: ProductStatusUpdate }) {
  const displayStatus = reverseStatusMapping[status];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Accepted: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-gray-100 text-gray-800 border-gray-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };

  const currentColor = statusColors[displayStatus];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${currentColor}`}
    >
      <div
        className={`mr-2 h-2 w-2 rounded-full ${
          displayStatus === "Pending"
            ? "bg-yellow-500"
            : displayStatus === "Accepted"
              ? "bg-green-500"
              : displayStatus === "Inactive"
                ? "bg-gray-500"
                : "bg-red-500"
        }`}
      />
      {displayStatus}
    </span>
  );
}

function ActionCell({ productId }: { productId: number }) {
  const handleEditClick = () => {};

  return (
    <Button variant="outline" size="sm" onClick={handleEditClick}>
      <Edit className="mr-1 h-4 w-4" />
      Edit
    </Button>
  );
}

export const columns: ColumnDef<ProductByBrand>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ProductStatusUpdate;
      return <StatusDisplay status={status} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell productId={row.original.id} />;
    },
  },
];
