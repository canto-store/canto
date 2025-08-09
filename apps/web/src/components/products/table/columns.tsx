import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { ProductByBrand } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Image from "next/image";

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
  const router = useRouter();
  const handleEditClick = () => {
    router.push(`/sell/product?productId=${productId}`);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleEditClick}>
      <Edit className="mr-1 h-4 w-4" />
      Edit
    </Button>
  );
}

export const columns: ColumnDef<ProductByBrand>[] = [
  {
    accessorKey: "image",
    header: () => <div className="text-left">Image</div>,
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <Image
          src={image}
          width={64}
          height={64}
          className="rounded-md"
          alt={row.getValue("name") as string}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: ({ row }) => {
      return <p className="text-sm font-medium">{row.getValue("name")}</p>;
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="text-left">Category</div>,
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <p className="text-sm">{category}</p>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as ProductStatusUpdate;
      return <StatusDisplay status={status} />;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-left">Actions</div>,
    cell: ({ row }) => {
      return <ActionCell productId={row.original.id} />;
    },
  },
];
