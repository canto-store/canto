import { GalleryVerticalEnd } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/auth-api'
import { useState } from 'react'
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      await api
        .login({
          username: data.username,
          password: data.password,
        })
        .catch(err => {
          setError(true)
          console.error('Login error:', err)
        })
        .finally(() => {
          setLoading(false)
        })
      router.navigate({ to: '/dashboard' })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 min-w-md">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Canto Dashboard</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Canto Dashboard</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">
                Login failed. Please check your credentials.
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
