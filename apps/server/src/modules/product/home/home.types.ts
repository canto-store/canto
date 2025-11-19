export type HomepageSectionDto = {
  title: string
  position: number
}

export type AddProductToSectionDto = {
  homepageSectionId: number
  productId: number
  position: number
}

export type HomeProducts = {
  id: number
  title: string
  description: string | null
  position: number
  created_at: string
  updated_at: string
  products: ProductSummary[]
}
export type ProductSummary = {
  id: number
  position: number
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
}
