import { Package, Building2, Users, Home } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/auth-api'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'Brands',
    url: '/dashboard/brands',
    icon: Building2,
  },
  {
    title: 'Sellers',
    url: '/dashboard/sellers',
    icon: Users,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogout = async () => {
    setLoading(true)
    await api.logout().finally(() => setLoading(false))
    router.navigate({ to: '/' })
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Package className="h-6 w-6" />
          <span className="font-semibold">Canto Store</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
