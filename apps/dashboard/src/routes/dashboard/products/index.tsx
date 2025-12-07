import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts } from '@/hooks/use-data'

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'
  brandId: number
  categoryId: number
  created_at: string
  updated_at: string
  brand: {
    name: string
  }
  category: {
    name: string
  }
}

type ProductStatusUpdate = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'

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

const reverseStatusMapping = {
  PENDING: 'Pending',
  ACTIVE: 'Accepted',
  INACTIVE: 'Inactive',
  REJECTED: 'Rejected',
} as const

const PRODUCTS_PAGE_KEY = 'products_page_index'

// Action cell component with router navigation
function ActionCell({ productId }: { productId: number }) {
  const router = useRouter()

  const handleEditClick = () => {
    router.navigate({
      to: '/dashboard/products/$productId/edit',
      params: { productId: productId.toString() },
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleEditClick}>
      <Edit className="h-4 w-4 mr-1" />
      Edit
    </Button>
  )
}

// Status display component
function StatusDisplay({ status }: { status: ProductStatusUpdate }) {
  const displayStatus = reverseStatusMapping[status]

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Accepted: 'bg-green-100 text-green-800 border-green-200',
    Inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
  }

  const currentColor = statusColors[displayStatus]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${currentColor}`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          displayStatus === 'Pending'
            ? 'bg-yellow-500'
            : displayStatus === 'Accepted'
              ? 'bg-green-500'
              : displayStatus === 'Inactive'
                ? 'bg-gray-500'
                : 'bg-red-500'
        }`}
      />
      {displayStatus}
    </span>
  )
}

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
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
    accessorKey: 'category.name',
    header: 'Category',
  },
  {
    accessorKey: 'brand.name',
    header: 'Brand',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as ProductStatusUpdate
      return <StatusDisplay status={status} />
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <ActionCell productId={row.original.id} />
    },
  },
]

export const Route = createFileRoute('/dashboard/products/')({
  component: ProductsPage,
})

// Loading skeleton component
function ProductsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts()
  const showSkeleton = useDelayedLoading(isLoading)

  const initialPageIndex = (() => {
    const stored = sessionStorage.getItem(PRODUCTS_PAGE_KEY)
    return stored ? parseInt(stored, 10) : 0
  })()

  const handlePageChange = (pageIndex: number) => {
    sessionStorage.setItem(PRODUCTS_PAGE_KEY, pageIndex.toString())
  }

  if (showSkeleton) {
    return <ProductsTableSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading products</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Search products..."
        initialPageIndex={initialPageIndex}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
