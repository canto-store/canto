"use client";

import { DataTable } from "@/components/common/data-table";
import { columns } from "./columns";
import { ProductByBrand } from "@/types";
import { Package } from "lucide-react";

export const ProductTable = ({ products }: { products: ProductByBrand[] }) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Package className="text-primary mb-4 h-16 w-16" />
        <span className="text-gray-500">No products added yet.</span>
      </div>
    );
  }
  return <DataTable columns={columns} data={products} showHeader={false} />;
};
