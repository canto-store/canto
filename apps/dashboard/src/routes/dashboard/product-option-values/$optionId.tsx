import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { useProductOptions } from '@/hooks/use-data'
import { useCreateProductOptionValue } from '@/hooks/use-data'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type OptionValue = {
  id: number
  value: string
}

export const Route = createFileRoute(
  '/dashboard/product-option-values/$optionId'
)({
  component: ProductOptionValuesPage,
})

function ProductOptionValuesPage() {
  const { optionId } = Route.useParams()
  const { data: options = [] } = useProductOptions()
  const createValue = useCreateProductOptionValue()
  const [newValue, setNewValue] = useState('')
  const [success, setSuccess] = useState<string | null>(null)

  const flash = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 2000)
  }

  const option = options.find(o => o.id === Number(optionId))
  const values: OptionValue[] = option?.values ?? []

  const columns: ColumnDef<OptionValue>[] = [
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{option?.name ?? 'Option'}</h1>
          <p className="text-muted-foreground">Manage values for this option</p>
        </div>
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
                productOptionId: Number(optionId),
                value: newValue.trim(),
              })
              setNewValue('')
              flash('Value added')
            }}
          >
            Add value
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={values}
        searchKey="value"
        searchPlaceholder="Search values..."
      />
    </div>
  )
}
