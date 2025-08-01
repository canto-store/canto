import { LoginForm } from '@/components/login-form'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { api } from '@/lib/auth-api'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    await api
      .me()
      .then(() => {
        throw redirect({ to: '/dashboard' })
      })
      .catch(() => undefined)
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
