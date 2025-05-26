export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  sizeChart?: string;
  brandId: number;
  categoryId: number;
  status: ProductStatus;
}

export enum ProductStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface SubmitProductFormDto {
  brandId: number;
  name: string;
  category: number;
  description: string;
  variants: SelectedVariant[];
}

export interface SelectedVariant {
  price: number;
  stock: number;
  images: string[];
  options: {
    optionId: number;
    valueId: number;
  }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateProductOptionDto {
  name: string;
}
export interface CreateProductOptionValueDto {
  value: string;
  productOptionId: number;
}

export interface CreateVariantImageDto {
  url: string;
  alt_text?: string;
}
export interface CreateProductVariantDto {
  productOptionId: any;
  productId: number;
  sku: string;
  price: number;
  stock: number;
  sale_id?: number;
  optionValueIds?: number[];
  images?: CreateVariantImageDto[];
}
export interface UpdateProductVariantDto
  extends Partial<CreateProductVariantDto> {
  productOptionId: any;
}
