import { Request, Response, NextFunction } from 'express'
import ProductService from './product.service'
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductOptionDto,
  CreateProductOptionValueDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  SubmitProductFormDto,
  ProductQueryParams,
  UpdateProductFormDto,
} from './product.types'
import { AuthRequest } from '../../middlewares/auth.middleware'
import AppError from '../../utils/appError'

class ProductController {
  private readonly productService = new ProductService()

  async createProduct(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const createProductDto = request.body as CreateProductDto
      const newProduct =
        await this.productService.createProduct(createProductDto)
      response.status(201).json(newProduct)
    } catch (error) {
      nextFunction(error)
    }
  }

  async getAllProducts(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const products = await this.productService.findAllProducts()
      response.status(200).json(products)
    } catch (error) {
      nextFunction(error)
    }
  }
  async searchProducts(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const queryParams: ProductQueryParams = {
        search: request.query.search as string,
        categorySlug: request.query.category as string,
        brandSlug: request.query.brand as string,
        status: request.query.status as any,
        minPrice: request.query.minPrice as string,
        maxPrice: request.query.maxPrice as string,
        colors: request.query.colors as string,
        size: request.query.size as string,
        inStock: request.query.inStock as string,
        sortBy: request.query.sortBy as any,
        sortOrder: request.query.sortOrder as any,
        page: request.query.page as string,
        limit: request.query.limit as string,
      }

      const result =
        await this.productService.findProductsWithFilters(queryParams)
      response.status(200).json(result)
    } catch (error) {
      nextFunction(error)
    }
  }

  async getProductFilters(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const filters = await this.productService.getProductFilters()
      response.status(200).json(filters)
    } catch (error) {
      nextFunction(error)
    }
  }

  async getPriceRange(_request: Request, response: Response) {
    const priceRange = await this.productService.getPriceRange()
    response.status(200).json(priceRange)
  }

  async getProductById(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const productId = Number(request.params.id)
      const product = await this.productService.getProductById(productId)
      response.status(200).json(product)
    } catch (error) {
      nextFunction(error)
    }
  }

  async updateProduct(
    request: AuthRequest,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const productId = Number(request.params.id)
      const updateProductDto = request.body as UpdateProductDto
      const updatedProduct = await this.productService.updateProduct(
        productId,
        updateProductDto
      )
      response.status(200).json(updatedProduct)
    } catch (error) {
      nextFunction(error)
    }
  }

  async deleteProduct(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const productId = Number(request.params.id)
      await this.productService.deleteProduct(productId)
      response.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async getProductBySlug(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const productSlug = request.params.slug
      const product = await this.productService.getProductBySlug(productSlug)
      response.status(200).json(product)
    } catch (error) {
      nextFunction(error)
    }
  }

  async createOption(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const createOptionDto = request.body as CreateProductOptionDto
      const newOption = await this.productService.createOption(createOptionDto)
      response.status(201).json(newOption)
    } catch (error) {
      nextFunction(error)
    }
  }

  async getOptions(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const options = await this.productService.getOptions()
      response.status(200).json(options)
    } catch (error) {
      nextFunction(error)
    }
  }

  async deleteOption(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const optionId = Number(request.params.id)
      await this.productService.deleteOption(optionId)
      response.status(200).json({ message: 'Option deleted' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async createOptionValue(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const createOptionValueDto = request.body as CreateProductOptionValueDto
      const newOptionValue =
        await this.productService.createOptionValue(createOptionValueDto)
      response.status(201).json(newOptionValue)
    } catch (error) {
      nextFunction(error)
    }
  }

  async deleteOptionValue(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const optionValueId = Number(request.params.id)
      await this.productService.deleteOptionValue(optionValueId)
      response.status(200).json({ message: 'Option value deleted' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async createVariant(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const createVariantDto = request.body as CreateProductVariantDto
      const newVariant =
        await this.productService.createVariant(createVariantDto)
      response.status(201).json(newVariant)
    } catch (error) {
      nextFunction(error)
    }
  }

  async updateVariant(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const variantId = Number(request.params.id)
      const updateVariantDto = request.body as UpdateProductVariantDto
      const updatedVariant = await this.productService.updateVariant(
        variantId,
        updateVariantDto
      )
      response.status(200).json(updatedVariant)
    } catch (error) {
      nextFunction(error)
    }
  }

  async deleteVariant(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const variantId = Number(request.params.id)
      await this.productService.deleteVariant(variantId)
      response.status(200).json({ message: 'Variant deleted' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async getHomeProducts(
    _request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const products = await this.productService.getHomeProducts()
      response.status(200).json(products)
    } catch (error) {
      nextFunction(error)
    }
  }

  async submitProductForm(
    request: AuthRequest,
    response: Response,
    nextFunction: NextFunction
  ) {
    const productForm = request.body as SubmitProductFormDto
    try {
      await this.productService.submitProductForm(productForm, request.user?.id)
      response.status(201).json({ message: 'Product created' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async updateProductForm(
    request: AuthRequest,
    response: Response,
    nextFunction: NextFunction
  ) {
    const productForm = request.body as UpdateProductFormDto
    try {
      await this.productService.updateProductForm(productForm, request.user?.id)
      response.status(200).json({ message: 'Product updated' })
    } catch (error) {
      nextFunction(error)
    }
  }

  async getProductsByBrand(
    request: AuthRequest,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const brandId = Number(request.params.brandId)
      if (!brandId) {
        return nextFunction(new AppError('Brand ID is required', 400))
      }
      const products = await this.productService.getProductsByBrand(brandId)
      response.status(200).json(products)
    } catch (error) {
      nextFunction(error)
    }
  }

  async autocompleteProducts(
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) {
    try {
      const query = request.query.query as string
      const products = await this.productService.autocompleteProducts(query)
      response.status(200).json(products)
    } catch (error) {
      nextFunction(error)
    }
  }
}

export default ProductController
