import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useRouterState } from '@tanstack/react-router'
export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const router = useRouter()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  console.log(pathname)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-8 max-h-screen">
          <div className="flex items-center justify-between">
            {pathname !== '/dashboard' && (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => router.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
          </div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
