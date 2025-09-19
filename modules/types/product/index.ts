export type ProductSummary = {
  name: string
  brand: {
    name: string
    slug: string
  }
  slug: string
  price: number
  maxPrice?: number
  salePrice?: number
  image: string
  stock: number
  hasVariants: boolean
  default_variant_id: number | null
  colorVariants: string[] | null
}
