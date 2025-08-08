export interface CreateProductDto {
  name: string
  slug: string
  description?: string
  sizeChart?: string
  brandId: number
  categoryId: number
  status: ProductStatus
}

export enum ProductStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
}

export interface SubmitProductFormDto {
  brandId: number
  name: string
  category: number
  description: string
  variants: SelectedVariant[]
}
export interface UpdateProductFormDto {
  id: number
  name: string
  slug: string
  category?: number
  description?: string
  variants: UpdateSelectedVariant[]
}
export interface SelectedVariant {
  price?: number
  stock?: number
  images?: string[]
  options?: {
    optionId?: number
    valueId?: number
  }[]
}

export interface UpdateSelectedVariant extends SelectedVariant {
  id?: number
}

export interface UpdateProductDto {
  name?: string
  description?: string
  categoryId?: number
  status?: ProductStatus
  rejectionReason?: string
}

export interface CreateProductOptionDto {
  name: string
}
export interface CreateProductOptionValueDto {
  value: string
  productOptionId: number
}

export interface CreateVariantImageDto {
  url: string
  alt_text?: string
}
export interface CreateProductVariantDto {
  productOptionId: any
  productId: number
  sku: string
  price: number
  stock: number
  sale_id?: number
  optionValueIds?: number[]
  images?: CreateVariantImageDto[]
}
export interface UpdateProductVariantDto
  extends Partial<CreateProductVariantDto> {
  productOptionId: any
}

export interface ProductQueryParams {
  search?: string
  categorySlug?: string
  brandSlug?: string
  status?: ProductStatus
  minPrice?: string
  maxPrice?: string
  colors?: string // comma-separated color values
  sizes?: string // comma-separated size values
  inStock?: string
  sortBy?: 'name' | 'price' | 'created_at' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: string
  limit?: string
}
