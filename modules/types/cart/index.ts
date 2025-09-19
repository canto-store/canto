import type { ProductSummary } from '../product/index'

export type CartItem = Omit<
  ProductSummary,
  'hasVariants' | 'colorVariants' | 'default_variant_id'
> & {
  variantId: number
  quantity: number
}

export type Cart = {
  items: CartItem[]
  count: number
  price: number
}
