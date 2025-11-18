import {
  Package,
  Building2,
  Home,
  UserCheck,
  UserStar,
  Settings,
  ShoppingBag,
  Receipt,
} from 'lucide-react'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/useUserStore'

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
    title: 'Product Options',
    url: '/dashboard/product-options',
    icon: Settings,
  },
  {
    title: 'Brands',
    url: '/dashboard/brands',
    icon: Building2,
  },
  {
    title: 'Sellers',
    url: '/dashboard/sellers',
    icon: UserStar,
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: UserCheck,
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Returns',
    url: '/dashboard/returns',
    icon: Receipt,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()

  const { logout } = useUserStore()

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/' })
  }

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false)
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
                  <SidebarMenuButton asChild onClick={handleNavigate}>
                    <Link to={item.url} onClick={handleNavigate}>
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
          >
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
