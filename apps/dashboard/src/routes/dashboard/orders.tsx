import { useOrders, useUpdateOrderStatus } from '@/hooks/use-data'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { type ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Order } from '@/types/order'

export const Route = createFileRoute('/dashboard/orders')({
  component: RouteComponent,
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 hover:bg-green-100 capitalize'
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100 capitalize'
    case 'PROCESSING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 capitalize'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-100 capitalize'
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100 capitalize'
  }
}

function StatusDropdown({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const { mutateAsync, isPending } = useUpdateOrderStatus()

  const statusOptions = [
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  const handleStatusChange = async (newStatus: string) => {
    await mutateAsync({ orderId, status: newStatus })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isPending}>
        <Badge className={getStatusColor(currentStatus)}>
          {isPending
            ? 'Updating...'
            : currentStatus.replace(/_/g, ' ').toLowerCase()}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={option.value === currentStatus || isPending}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'orderId',
    header: 'Order ID',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.id}</div>
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div>
          {row.original.user?.name || row.original.customerName || 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: 'customerNumber',
    header: 'Phone Number',
    cell: ({ row }) => {
      return <div>{row.original.user?.phone_number || 'N/A'}</div>
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const orderId = row.original.id
      return <StatusDropdown orderId={orderId} currentStatus={status} />
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return date.toLocaleDateString()
    },
  },
]

function RouteComponent() {
  const { data: orders, isLoading, error, isRefetching } = useOrders()

  if (isLoading || isRefetching) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-destructive">Failed to load orders</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <DataTable
        columns={columns}
        data={orders || []}
        searchKey="orderId"
        searchPlaceholder="Search orders..."
      />
    </div>
  )
}
