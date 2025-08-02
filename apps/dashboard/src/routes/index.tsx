import { LoginForm } from '@/components/login-form'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { api } from '@/lib/auth-api'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const isAuthenticated = await api
      .me()
      .then(() => true)
      .catch(() => false)
    if (isAuthenticated) throw redirect({ to: '/dashboard' })
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
