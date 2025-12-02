import { z } from 'zod'

const selectedVariantSchema = z.object({
  id: z.number().optional(), // Add optional id for updates
  sku: z.string().optional(), // Make optional for updates
  price: z.number().positive().optional(), // Make optional for updates
  stock: z.number().int().positive().optional(), // Make optional for updates
  options: z
    .array(
      z.object({
        optionId: z.number(),
        valueId: z.number(),
      })
    )
    .optional(), // Make optional for updates
  images: z.array(z.string()).optional(), // Make optional for updates
})
export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.number().min(1, 'Category is required'),
  subcategories: z.array(z.number()).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED'] as const),
  rejectionReason: z.string().optional(),
  variants: z.array(selectedVariantSchema),
  returnWindow: z
    .number()
    .min(0, 'Return window must be at least 0 days')
    .optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
export type SelectedVariant = z.infer<typeof selectedVariantSchema>

export type Product = {
  id: number
  name: string
  description: string | null
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'
  rejectionReason: string | null
}
export interface ProductOption {
  id: number
  name: string
  values: OptionValue[]
}

export interface OptionValue {
  id: number
  value: string
}
