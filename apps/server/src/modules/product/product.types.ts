export interface CreateProductDto {
    name:        string;
    slug:        string;
    description?:string;
    sizeChart?:  string;
    brandId:     number;
    categoryId:  number;
  }
  export interface UpdateProductDto extends Partial<CreateProductDto> {}
  
  export interface CreateProductOptionDto    { name: string }
  export interface CreateProductOptionValueDto {
    value: string; productOptionId: number;
  }
  
  export interface CreateVariantImageDto     { url: string; alt_text?: string }
  export interface CreateProductVariantDto {
    productId:       number;
    sku:             string;
    price:           number;
    stock:           number;
    sale_id?:        number;
    optionValueIds?: number[];
    images?:         CreateVariantImageDto[];
  }
  export interface UpdateProductVariantDto extends Partial<CreateProductVariantDto> {}
  