import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useReturns, useUpdateReturnStatus } from '@/hooks/use-data'
import type { Return } from '@/types/return'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/returns')({
  component: RouteComponent,
})

// Hook to delay showing loading state
function useDelayedLoading(isLoading: boolean, delay: number = 300) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(false)
    }
  }, [isLoading, delay])

  return showLoading
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'REFUNDED':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100 capitalize'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 capitalize'
    case 'REJECTED':
      return 'bg-red-100 text-red-800 hover:bg-red-100 capitalize'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100 capitalize'
  }
}
function StatusDropdown({
  returnId,
  currentStatus,
}: {
  returnId: number
  currentStatus: string
}) {
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'REFUNDED', label: 'Refunded' },
    { value: 'REJECTED', label: 'Rejected' },
  ]

  const { mutateAsync, isPending } = useUpdateReturnStatus()
  const handleStatusChange = async (newStatus: string) => {
    await mutateAsync({ returnId, status: newStatus })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending}>
        <Badge className={getStatusColor(currentStatus)}>
          {isPending ? 'Updating...' : currentStatus}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={option.value === currentStatus}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<Return>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Return ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const returnId = row.getValue('id') as number
      return <div className="font-mono text-sm">{returnId}</div>
    },
  },
  {
    accessorKey: 'orderItem.order.user.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original.orderItem.order.user
      if (!user) return <div>-</div>

      return (
        <div>
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'reason',
    header: 'Return Reason',
    cell: ({ row }) => {
      const reason = row.getValue('reason') as string
      return (
        <div className="max-w-[200px]">
          <div className="text-sm truncate" title={reason}>
            {reason}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Return Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <StatusDropdown returnId={row.original.id} currentStatus={status} />
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'orderItem.priceAtOrder',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-medium"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = row.original.orderItem.priceAtOrder
      const quantity = row.original.orderItem.quantity
      const totalAmount = price * quantity

      return <div className="font-medium">EGP{totalAmount.toFixed(2)}</div>
    },
  },
]

function RouteComponent() {
  const { data: returns, isLoading, error } = useReturns()
  const showDelayedLoading = useDelayedLoading(isLoading)

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Returns
          </h3>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : 'Failed to load returns data'}
          </p>
        </div>
      </div>
    )
  }

  if (showDelayedLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const returnsData = returns?.returnRequests || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Returns Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track product return requests from customers
        </p>
      </div>

      <DataTable
        columns={columns}
        data={returnsData}
        searchKey="orderItem.order.user"
        searchPlaceholder="Search by customer..."
      />

      {returnsData.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">No returns found</div>
            <p>There are currently no return requests to display.</p>
          </div>
        </div>
      )}
    </div>
  )
}
