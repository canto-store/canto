import { LoginForm } from '@/components/login-form'
import { useUserStore } from '@/stores/useUserStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isAuthenticated } = useUserStore.getState()
    if (isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex min-h-screen  items-center justify-center">
      <LoginForm />
    </main>
  )
}
