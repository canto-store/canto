import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  aspect: z.enum(['SQUARE', 'RECTANGLE']),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.number().optional(),
  coming_soon: z.boolean().optional(),
})

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
})

export type CreateCategoryDto = z.infer<typeof createCategorySchema>
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>

export type Category = {
  id: number
  name: string
  slug: string
  aspect: 'SQUARE' | 'RECTANGLE'
  description: string | null
  image: string | null
  parentId: number | null
  coming_soon: boolean
  children?: Category[]
}
