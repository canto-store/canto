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
import { useLatestActivities, useDashboardCounts } from '@/hooks/use-data'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    const isAuthenticated = await api
      .me()
      .then(res => {
        if (res.data.role.includes('ADMIN')) return true
        else throw redirect({ to: '/' })
      })
      .catch(() => false)
    if (!isAuthenticated) throw redirect({ to: '/' })
  },
  component: DashboardIndexPage,
})

function LoadingData() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-6 w-10 rounded-md" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

function DashboardIndexPage() {
  const { data: latestActivities, isLoading: isFetchingLatestActivities } =
    useLatestActivities()

  const { data, isLoading } = useDashboardCounts()
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Canto Store</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
        {/* Products Card */}
        <Link to="/dashboard/products">
          <Card className="h-38">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingData />
              ) : (
                <>
                  <p className="text-2xl font-bold">{data?.product.total}</p>
                  <p className="text-xs font-bold text-green-300">
                    {data?.product.active} Active
                  </p>
                  <p className="text-xs font-bold text-orange-300">
                    {data?.product.pending} Pending
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        {/* Brands Card */}
        <Link to="/dashboard/brands">
          <Card className="h-38">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Brands</CardTitle>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingData />
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold">{data?.brand.total}</p>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        {/* Sellers Card */}
        <Link to="/dashboard/sellers">
          <Card className="h-38">
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm font-medium">Sellers</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingData />
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold">{data?.seller.total}</p>
                  <p className="text-xs text-muted-foreground">
                    +100% from last month
                  </p>
                </div>
              )}
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
    </main>
  )
}
