export type CreateCategoryDto = {
  name: string
  slug: string
  aspect: 'SQUARE' | 'RECTANGLE'
  description?: string
  image?: string
  parentId?: number 
}
