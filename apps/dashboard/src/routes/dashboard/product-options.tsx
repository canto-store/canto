import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { useProductOptions } from '@/hooks/use-data'

type OptionValue = {
  id: number
  value: string
}

type ProductOption = {
  id: number
  name: string
  values: OptionValue[]
}

export const Route = createFileRoute('/dashboard/product-options')({
  component: ProductOptionsPage,
})

function ProductOptionsPage() {
  const { data: options = [] } = useProductOptions()

  const optionColumns: ColumnDef<ProductOption>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Option
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const option = row.original
        return (
          <div className="flex gap-2">
            <Link
              to="/dashboard/product-option-values/$optionId"
              params={{ optionId: String(option.id) }}
            >
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" /> View values
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Product Options</h1>
        <p className="text-muted-foreground">Manage product options</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Options</h2>
        <DataTable
          columns={optionColumns}
          data={options}
          searchKey="name"
          searchPlaceholder="Search options..."
        />
      </div>
      {null}
    </div>
  )
}
