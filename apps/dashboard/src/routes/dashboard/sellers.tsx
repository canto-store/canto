import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useSellers } from '@/hooks/use-data'

interface Seller {
  id: string
  name: string
  email: string
  phone_number: string
  company?: string
  status?: 'active' | 'inactive' | 'pending'
  totalSales?: number
  created_at?: string
}

// Hook to delay showing loading state
function useDelayedLoading(isLoading: boolean, delay: number = 300) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay])

  return showLoading
}

const columns: ColumnDef<Seller>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone',
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => {
      const dateValue = row.getValue('created_at')
      if (!dateValue) return '-'
      const date = new Date(dateValue as string)
      return date.toLocaleDateString()
    },
  },
]

export const Route = createFileRoute('/dashboard/sellers')({
  component: SellersPage,
})

// Loading skeleton component
function SellersTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-56" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SellersPage() {
  const { data: sellers = [], isLoading, error } = useSellers()
  const showSkeleton = useDelayedLoading(isLoading)

  if (showSkeleton) {
    return <SellersTableSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading sellers</div>
      </div>
    )
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
  )
}
