import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  categoryId: z.number().min(1, 'Category is required'),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED'] as const),
  rejectionReason: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export type Product = {
  id: number
  name: string
  description: string | null
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'
  rejectionReason: string | null
}
