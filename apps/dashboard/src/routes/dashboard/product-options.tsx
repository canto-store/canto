import { createFileRoute, Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { useCreateProductOption, useProductOptions } from '@/hooks/use-data'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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

  const [newValue, setNewValue] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const createValue = useCreateProductOption()

  const flash = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 2000)
  }

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
    <div className="space-y-6">
      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-3xl font-bold">Product Options</h1>
        <p className="text-muted-foreground">Manage product options</p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Input
            placeholder="New value"
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="w-full sm:w-56"
          />
          <Button
            className="w-full sm:w-auto"
            disabled={!newValue.trim() || createValue.isPending}
            onClick={async () => {
              if (!newValue.trim()) return
              await createValue.mutateAsync({
                name: newValue.trim(),
              })
              setNewValue('')
              flash('Value added')
            }}
          >
            Add value
          </Button>
        </div>
      </div>

      <div className="space-y-3">
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
