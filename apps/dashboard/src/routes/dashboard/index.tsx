import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { Package, Building2, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/auth-api'
import { useLatestActivities, useProductCount } from '@/hooks/use-data'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    const isAuthenticated = await api
      .me()
      .then(() => true)
      .catch(() => false)
    if (!isAuthenticated) throw redirect({ to: '/' })
  },
  component: DashboardIndexPage,
})

function DashboardIndexPage() {
  const { data: latestActivities, isLoading: isFetchingLatestActivities } =
    useLatestActivities()

  const { data: productCount, isLoading: isFetchingProductCount } =
    useProductCount()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
        <Link to="/dashboard/products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isFetchingProductCount ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                <>
                  <p className="text-sm font-bold text-green-300">
                    {productCount?.activeProductsCount} Active
                  </p>
                  <p className="text-sm font-bold text-orange-300">
                    {productCount?.pendingProductsCount} Pending
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link to="/dashboard/brands">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/sellers">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sellers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +12.3% from last month
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates in Canto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFetchingLatestActivities && (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          )}

          {latestActivities && latestActivities.length === 0 && (
            <p className="text-center">No Recent Activities</p>
          )}

          {latestActivities?.map((activity, index) => (
            <div key={index} className="text-sm">
              {activity}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
