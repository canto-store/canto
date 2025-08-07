import { DataTable } from "@/components/common/data-table";
import { columns } from "./columns";
import { ProductByBrand } from "@/types";

export const ProductTable = ({ products }: { products: ProductByBrand[] }) => {
  return <DataTable columns={columns} data={products} showHeader={false} />;
};
