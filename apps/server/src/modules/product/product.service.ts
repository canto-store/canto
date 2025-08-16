import { Prisma, PrismaClient, Product } from '@prisma/client'
import AppError from '../../utils/appError'
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductOptionDto,
  CreateProductOptionValueDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  SubmitProductFormDto,
  ProductStatus,
  ProductQueryParams,
  UpdateProductFormDto,
} from './product.types'
import {
  slugify,
  formatPrice,
  calculateDiscount,
  calculateDiscountPercentage,
} from '../../utils/helper'
import { PRODUCT_INDEX } from '../../services/elasticsearch/productIndex'
import { esClient } from '../../services/elasticsearch'

class ProductService {
  private readonly prisma = new PrismaClient()

  async createProduct(dto: CreateProductDto) {
    if (!dto.name?.trim()) throw new AppError('name is required', 400)
    if (!dto.slug?.trim()) throw new AppError('slug is required', 400)

    await this.ensureBrandExists(dto.brandId)
    await this.ensureCategoryExists(dto.categoryId)

    const existingProductWithSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    })
    if (existingProductWithSlug)
      throw new AppError('Product with this slug already exists', 409)

    return this.prisma.product.create({ data: dto })
  }

  async findAllProducts() {
    return this.prisma.product.findMany({
      include: { brand: true, category: true },
      orderBy: { id: 'desc' },
    })
  }

  async findProductsWithFilters(queryParams: ProductQueryParams) {
    const {
      search,
      categorySlug,
      brandSlug,
      status,
      minPrice,
      maxPrice,
      colors,
      sizes,
      inStock,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = queryParams

    const where: Prisma.ProductWhereInput = {}

    // Store Elasticsearch scores and product order for sorting
    const elasticsearchScores: Map<number, number> = new Map()
    const elasticsearchOrder: number[] = []

    if (search) {
      const results = await esClient.search({
        index: PRODUCT_INDEX,
        body: {
          query: {
            bool: {
              should: [
                // 1. Exact phrase match (highest priority)
                {
                  match_phrase: {
                    name: {
                      query: search.trim(),
                      boost: 5,
                    },
                  },
                },
                // 2. Exact keyword match
                {
                  term: {
                    'name.exact': {
                      value: search.trim(),
                      boost: 4,
                    },
                  },
                },
                // 3. Partial word matching (n-grams)
                {
                  match: {
                    'name.ngram': {
                      query: search.trim(),
                      boost: 3,
                    },
                  },
                },
                // 4. Fuzzy matching on name
                {
                  match: {
                    name: {
                      query: search.trim(),
                      fuzziness: 'AUTO',
                      boost: 2,
                    },
                  },
                },
                // 5. Description search (lower priority)
                {
                  match: {
                    description: {
                      query: search.trim(),
                      fuzziness: 'AUTO',
                      boost: 1,
                    },
                  },
                },
                // 6. Prefix matching for partial words
                {
                  prefix: {
                    name: {
                      value: search.trim().toLowerCase(),
                      boost: 1.5,
                    },
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          size: +limit,
        },
      })

      // Extract product IDs, scores, and preserve order from Elasticsearch
      const productIds: number[] = []
      results.hits.hits.forEach((hit: any) => {
        const productId = +hit._id
        productIds.push(productId)
        elasticsearchScores.set(productId, hit._score)
        elasticsearchOrder.push(productId)
      })

      where.id = { in: productIds }
    }

    if (categorySlug) where.category = { slug: categorySlug }
    if (brandSlug) where.brand = { slug: brandSlug }
    if (status) where.status = status as ProductStatus
    const variantFilters: Prisma.ProductVariantWhereInput[] = []

    if (minPrice) variantFilters.push({ price: { gte: parseFloat(minPrice) } })
    if (maxPrice) variantFilters.push({ price: { lte: parseFloat(maxPrice) } })
    if (inStock === 'true') variantFilters.push({ stock: { gt: 0 } })

    if (colors) {
      const vals = colors.split(',').map(c => c.trim())
      variantFilters.push({
        optionLinks: {
          some: {
            productOption: { name: { equals: 'Color', mode: 'insensitive' } },
            optionValue: { value: { in: vals, mode: 'insensitive' } },
          },
        },
      })
    }

    if (sizes) {
      const vals = sizes.split(',').map(s => s.trim())
      variantFilters.push({
        optionLinks: {
          some: {
            productOption: { name: { equals: 'Size', mode: 'insensitive' } },
            optionValue: { value: { in: vals, mode: 'insensitive' } },
          },
        },
      })
    }

    // Apply the variant-filters to the top-level `where` so we only fetch
    // products that have at least one variant matching _all_ of them:
    if (variantFilters.length > 0) {
      where.variants = { some: { AND: variantFilters } }
    }

    // 4) Pagination & sorting setup
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    where.status = ProductStatus.ACTIVE

    // 5) Fetch matching products + total count
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          variants: {
            // Only return the variants that matched our filters
            where: variantFilters.length ? { AND: variantFilters } : {},
            include: {
              images: true,
              optionLinks: {
                include: { optionValue: true, productOption: true },
              },
            },
          },
        },
        // If sorting by price or if we have search results, we'll sort in JS afterwards
        orderBy:
          sortBy === 'price' || search
            ? { created_at: 'desc' }
            : { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      this.prisma.product.count({ where }),
    ])

    // 6) Sort products - prioritize Elasticsearch scores for search, then other criteria
    if (search && elasticsearchOrder.length > 0) {
      // Sort by Elasticsearch score (relevance) when searching
      products.sort((a, b) => {
        const aIndex = elasticsearchOrder.indexOf(a.id)
        const bIndex = elasticsearchOrder.indexOf(b.id)
        // Products found by Elasticsearch should come first, in their scored order
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex // Preserve Elasticsearch ordering
        }
        if (aIndex !== -1) return -1 // a is in search results, prioritize it
        if (bIndex !== -1) return 1 // b is in search results, prioritize it
        return 0 // Both not in search results, maintain current order
      })
    } else if (sortBy === 'price') {
      // Sort by price when not searching
      products.sort((a, b) => {
        const aMin = Math.min(...a.variants.map(v => v.price))
        const bMin = Math.min(...b.variants.map(v => v.price))
        return sortOrder === 'asc' ? aMin - bMin : bMin - aMin
      })
    }

    const formatted = products.map(p => {
      if (!p.variants || p.variants.length === 0) {
        return {
          name: p.name,
          slug: p.slug,
          brand: {
            name: p.brand.name,
            slug: p.brand.slug,
          },
          price: 0,
          image: '/placeholder-image.jpg',
          stock: 0,
          hasVariants: false,
          default_variant_id: null,
          colorVariants: [],
        }
      }

      const prices = p.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        name: p.name,
        slug: p.slug,
        brand: {
          name: p.brand.name,
          slug: p.brand.slug,
        },
        price: minPrice,
        maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
        image: p.variants[0]?.images[0]?.url || '/placeholder-image.jpg',
        stock: p.variants.reduce((sum, v) => sum + v.stock, 0),
        hasVariants: p.variants.length > 1,
        default_variant_id: p.variants.length === 1 ? p.variants[0]?.id : null,
        colorVariants: [
          ...new Set(
            p.variants.flatMap(v =>
              v.optionLinks
                .filter(
                  link => link.productOption.name.toLowerCase() === 'color'
                )
                .map(link => link.optionValue.value)
            )
          ),
        ],
      }
    })

    return {
      products: formatted,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    }
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const { rejectionReason, ...updateProductData } = dto
    return await this.prisma.$transaction(async tx => {
      try {
        const product = await tx.product.update({
          where: { id },
          data: updateProductData,
        })
        // creating rejection reason
        if (rejectionReason && dto.status !== ProductStatus.REJECTED) {
          await tx.productRejection.create({
            data: {
              productId: id,
              reason: rejectionReason,
            },
          })
        }
        // updating rejection reason
        if (rejectionReason) {
          await tx.productRejection.update({
            where: { productId: id },
            data: { reason: rejectionReason },
          })
        }
        // deleting rejection reason if product is no longer rejected
        if (
          product.status === ProductStatus.REJECTED &&
          dto.status !== ProductStatus.REJECTED
        ) {
          await tx.productRejection.delete({ where: { productId: id } })
        }
      } catch (error) {
        throw new AppError(error, 500)
      }
    })
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } })
  }

  async createOption(dto: CreateProductOptionDto) {
    if (!dto.name?.trim()) throw new AppError('name is required', 400)

    const existingOptionWithName = await this.prisma.productOption.findUnique({
      where: { name: dto.name },
    })
    if (existingOptionWithName)
      throw new AppError('Option with this name already exists', 409)

    return this.prisma.productOption.create({ data: dto })
  }

  async getOptions() {
    return this.prisma.productOption.findMany({ include: { values: true } })
  }

  async deleteOption(id: number) {
    await this.ensureOptionExists(id)
    return this.prisma.productOption.delete({ where: { id } })
  }

  async createOptionValue(dto: CreateProductOptionValueDto) {
    if (!dto.value?.trim()) throw new AppError('value is required', 400)
    await this.ensureOptionExists(dto.productOptionId)

    const existingOptionValue = await this.prisma.productOptionValue.findFirst({
      where: { productOptionId: dto.productOptionId, value: dto.value },
    })
    if (existingOptionValue)
      throw new AppError('Value already exists under this option', 409)

    return this.prisma.productOptionValue.create({ data: dto })
  }

  async deleteOptionValue(id: number) {
    await this.ensureOptionValueExists(id)
    return this.prisma.productOptionValue.delete({ where: { id } })
  }

  async createVariant(dto: CreateProductVariantDto) {
    await this.getProductById(dto.productId)
    if (!dto.sku?.trim()) throw new AppError('sku is required', 400)
    if (dto.price == null || dto.price < 0)
      throw new AppError('price must be >= 0', 400)
    if (dto.stock == null || dto.stock < 0)
      throw new AppError('stock must be >= 0', 400)

    const existingVariantSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    })
    if (existingVariantSku)
      throw new AppError('Variant with this SKU already exists', 409)

    if (dto.optionValueIds?.length) {
      await Promise.all(
        dto.optionValueIds.map(id => this.ensureOptionValueExists(id))
      )
    }

    return this.prisma.$transaction(async tx => {
      const variantRecord = await tx.productVariant.create({
        data: {
          productId: dto.productId,
          sku: dto.sku,
          price: dto.price,
          stock: dto.stock,
          sale_id: dto.sale_id ?? null,
        },
      })

      if (dto.optionValueIds?.length) {
        const variantOptionValuesData = await Promise.all(
          dto.optionValueIds.map(async optionValueId => {
            const productOptionValue = await tx.productOptionValue.findUnique({
              where: { id: optionValueId },
              select: { productOptionId: true },
            })
            if (!productOptionValue) {
              throw new AppError(
                `ProductOptionValue with id ${optionValueId} not found within transaction.`,
                404
              )
            }
            if (productOptionValue.productOptionId == null) {
              throw new AppError(
                `ProductOptionValue with id ${optionValueId} is missing its productOptionId.`,
                500
              )
            }
            return {
              variantId: variantRecord.id,
              optionValueId,
              productOptionId: productOptionValue.productOptionId,
            }
          })
        )

        await tx.variantOptionValue.createMany({
          data: variantOptionValuesData,
        })
      }

      if (dto.images?.length) {
        await tx.productVariantImage.createMany({
          data: dto.images.map(image => ({
            ...image,
            variantId: variantRecord.id,
          })),
        })
      }

      return tx.productVariant.findUnique({
        where: { id: variantRecord.id },
        include: {
          images: true,
          optionLinks: { include: { optionValue: true } },
        },
      })
    })
  }

  async updateVariant(id: number, dto: UpdateProductVariantDto) {
    const existingVariant = await this.ensureVariantExists(id)

    if (dto.sku && dto.sku !== existingVariant.sku) {
      const existingVariantSku = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      })
      if (existingVariantSku) throw new AppError('SKU already in use', 409)
    }
    if (dto.price != null && dto.price < 0)
      throw new AppError('price must be >= 0', 400)
    if (dto.stock != null && dto.stock < 0)
      throw new AppError('stock must be >= 0', 400)

    const updateData: Prisma.ProductVariantUpdateInput = {}
    if (dto.sku != null) updateData.sku = dto.sku
    if (dto.price != null) updateData.price = dto.price
    if (dto.stock != null) updateData.stock = dto.stock
    if (dto.sale_id != null) updateData.sale = { connect: { id: dto.sale_id } }

    const variantRecord = await this.prisma.productVariant.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        optionLinks: { include: { optionValue: true } },
      },
    })

    if (dto.optionValueIds || dto.images) {
      return this.prisma.$transaction(async tx => {
        if (dto.optionValueIds) {
          await tx.variantOptionValue.deleteMany({ where: { variantId: id } })
          if (dto.optionValueIds.length) {
            await tx.variantOptionValue.createMany({
              data: dto.optionValueIds.map(optionValueId => ({
                variantId: id,
                optionValueId,
                productOptionId: dto.productOptionId,
              })),
            })
          }
        }

        if (dto.images) {
          await tx.productVariantImage.deleteMany({ where: { variantId: id } })
          if (dto.images.length) {
            await tx.productVariantImage.createMany({
              data: dto.images.map(image => ({ ...image, variantId: id })),
            })
          }
        }

        return tx.productVariant.findUnique({
          where: { id },
          include: {
            images: true,
            optionLinks: { include: { optionValue: true } },
          },
        })
      })
    }

    return variantRecord
  }

  async deleteVariant(id: number) {
    await this.ensureVariantExists(id)
    return this.prisma.productVariant.delete({ where: { id } })
  }

  async getProductBySlug(slug: string) {
    const productRecord = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        variants: {
          include: {
            images: true,
            optionLinks: {
              include: {
                optionValue: {
                  select: {
                    value: true,
                    productOption: { select: { name: true } },
                  },
                },
              },
            },
            sale: true,
          },
        },
      },
    })

    if (!productRecord) throw new AppError('Product not found', 404)

    const priceList = productRecord.variants.map(v => v.price)
    const minimumPrice = priceList.length ? Math.min(...priceList) : 0
    const maximumPrice = priceList.length ? Math.max(...priceList) : 0

    const totalStock = productRecord.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    )
    const inStock = totalStock > 0

    const variants = productRecord.variants.map(variant => {
      const variantOptions: Record<string, string> = {}
      variant.optionLinks.forEach(link => {
        variantOptions[link.optionValue.productOption.name] =
          link.optionValue.value
      })

      const discountedPrice = variant.sale
        ? calculateDiscount(variant.price, variant.sale)
        : variant.price
      const discountPercentage = variant.sale
        ? calculateDiscountPercentage(variant.price, discountedPrice)
        : 0

      return {
        id: variant.id,
        sku: variant.sku,
        price: discountedPrice,
        price_formatted: formatPrice(discountedPrice),
        original_price: variant.price,
        original_price_formatted: formatPrice(variant.price),
        discount_percentage: discountPercentage,
        stock: variant.stock,
        options: variantOptions,
        images: variant.images.map(image => ({
          url: image.url,
          alt_text: image.alt_text,
        })),
      }
    })

    const relatedRaw = await this.prisma.product.findMany({
      where: {
        categoryId: productRecord.categoryId,
        id: { not: productRecord.id },
      },
      take: 4,
      include: { brand: true, variants: { include: { images: true } } },
    })

    const relatedProducts = relatedRaw.map(related => {
      const relatedPrices = related.variants.map(v => v.price)
      return {
        id: related.id,
        name: related.name,
        slug: related.slug,
        image: related.variants[0]?.images[0]?.url ?? '',
        brand: { name: related.brand.name, slug: related.brand.slug },
        price_range: {
          original: {
            min_price: Math.min(...relatedPrices),
            max_price: Math.max(...relatedPrices),
          },
          discounted: {
            min_price: Math.min(...relatedPrices),
            max_price: Math.max(...relatedPrices),
          },
        },
      }
    })

    return {
      name: productRecord.name,
      slug: productRecord.slug,
      description: productRecord.description,
      brand: productRecord.brand,
      category: productRecord.category,
      in_stock: inStock,
      total_stock: totalStock,
      price_range: {
        min_price: formatPrice(minimumPrice),
        max_price: formatPrice(maximumPrice),
      },
      variants,
      default_variant_id:
        productRecord.variants.length === 1
          ? productRecord.variants[0].id
          : null,
      reviews: { count: 0, rating: 0 },
      related_products: relatedProducts,
    }
  }

  async getHomeProducts() {
    const products = await this.prisma.product.findMany({
      select: {
        name: true,
        brand: { select: { name: true, slug: true } },
        slug: true,
        variants: {
          select: { images: true, price: true, id: true, stock: true },
        },
      },
    })
    const colorVariantOption = await this.prisma.productOption.findUnique({
      where: { name: 'Color' },
    })
    const colorVariantValues = await this.prisma.variantOptionValue.findMany({
      where: {
        productOptionId: colorVariantOption.id,
        variant: {
          productId: {
            in: products.flatMap(p => p.variants.map(v => v.id)),
          },
        },
      },
      select: {
        variantId: true,
        optionValue: {
          select: {
            value: true,
          },
        },
      },
    })
    const bestSellers = products.slice(0, 5).map(product => {
      if (!product.variants || product.variants.length === 0) {
        return {
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          price: 0,
          image: '/placeholder-image.jpg',
          stock: 0,
          hasVariants: false,
          default_variant_id: null,
          colorVariants: [],
        }
      }

      const prices = product.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        price: minPrice,
        maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
        image: product.variants[0]?.images[0]?.url || '/placeholder-image.jpg',
        stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
        hasVariants: product.variants.length > 1,
        default_variant_id:
          product.variants.length === 1 ? product.variants[0]?.id : null,
        colorVariants: [
          ...new Set(
            colorVariantValues
              .filter(v => product.variants.some(p => p.id === v.variantId))
              .map(v => v.optionValue.value)
          ),
        ],
      }
    })
    const bestDeals = products.slice(5, 10).map(product => {
      if (!product.variants || product.variants.length === 0) {
        return {
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          price: 0,
          image: '/placeholder-image.jpg',
          stock: 0,
          hasVariants: false,
          default_variant_id: null,
          colorVariants: [],
        }
      }

      const prices = product.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        price: minPrice,
        maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
        image: product.variants[0]?.images[0]?.url || '/placeholder-image.jpg',
        stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
        default_variant_id:
          product.variants.length === 1 ? product.variants[0]?.id : null,
        hasVariants: product.variants.length > 1,
        colorVariants: [
          ...new Set(
            colorVariantValues
              .filter(v => product.variants.some(p => p.id === v.variantId))
              .map(v => v.optionValue.value)
          ),
        ],
      }
    })
    const newArrivals = products.slice(10, 15).map(product => {
      if (!product.variants || product.variants.length === 0) {
        return {
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          price: 0,
          image: '/placeholder-image.jpg',
          stock: 0,
          hasVariants: false,
          default_variant_id: null,
          colorVariants: [],
        }
      }

      const prices = product.variants.map(v => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        name: product.name,
        brand: product.brand,
        slug: product.slug,
        price: minPrice,
        maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
        image: product.variants[0]?.images[0]?.url || '/placeholder-image.jpg',
        stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
        hasVariants: product.variants.length > 1,
        default_variant_id:
          product.variants.length === 1 ? product.variants[0]?.id : null,
        colorVariants: [
          ...new Set(
            colorVariantValues
              .filter(v => product.variants.some(p => p.id === v.variantId))
              .map(v => v.optionValue.value)
          ),
        ],
      }
    })
    return {
      bestSellers,
      bestDeals,
      newArrivals,
    }
  }

  async updateProductForm(dto: UpdateProductFormDto, userId: number) {
    return this.prisma.$transaction(async tx => {
      const productUpdateData: Record<string, any> = {}

      if (dto.name !== undefined) {
        productUpdateData.name = dto.name
      }
      if (dto.description !== undefined) {
        productUpdateData.description = dto.description
      }
      if (dto.category !== undefined) {
        productUpdateData.categoryId = dto.category
      }
      if (dto.status !== undefined) {
        productUpdateData.status = dto.status
      }

      let updatedProduct: Product
      if (Object.keys(productUpdateData).length > 0) {
        updatedProduct = await tx.product.update({
          where: { id: dto.id },
          data: productUpdateData,
        })
      } else {
        updatedProduct = await tx.product.findUnique({
          where: { id: dto.id },
        })
      }

      await tx.activity.create({
        data: {
          entityId: updatedProduct.id,
          entityName: updatedProduct.name,
          type: 'PRODUCT_UPDATED',
          createdByid: userId,
        },
      })
      if (dto.variants) {
        const currentVariants = await tx.productVariant.findMany({
          where: { productId: dto.id },
          select: { id: true },
        })

        const currentVariantIds = currentVariants.map(v => v.id)
        const updatedVariantIds = dto.variants.map(v => v.id).filter(Boolean)
        const newVariantsCount = dto.variants.filter(v => !v.id).length

        const hasVariantChanges =
          currentVariantIds.length !== updatedVariantIds.length

        const hasNewVariants = newVariantsCount > 0

        if (hasVariantChanges || hasNewVariants) {
          const variantsToDelete = currentVariantIds.filter(
            id => !updatedVariantIds.includes(id)
          )

          if (variantsToDelete.length > 0) {
            await tx.productVariant.deleteMany({
              where: { id: { in: variantsToDelete } },
            })
          }
        }

        for (const variant of dto.variants) {
          if (variant.id) {
            const variantUpdateData: Record<string, any> = {}

            if (variant.price !== undefined) {
              variantUpdateData.price = variant.price
            }
            if (variant.stock !== undefined) {
              variantUpdateData.stock = variant.stock
            }

            if (Object.keys(variantUpdateData).length > 0) {
              await tx.productVariant.update({
                where: { id: variant.id },
                data: variantUpdateData,
              })
            }

            if (variant.images) {
              await tx.productVariantImage.deleteMany({
                where: { variantId: variant.id },
              })

              if (variant.images.length > 0) {
                await tx.productVariantImage.createMany({
                  data: variant.images.map(image => ({
                    variantId: variant.id,
                    url: image,
                    alt_text: dto.name,
                  })),
                })
              }
            }

            if (variant.options) {
              await tx.variantOptionValue.deleteMany({
                where: { variantId: variant.id },
              })

              if (variant.options.length > 0) {
                await tx.variantOptionValue.createMany({
                  data: variant.options.map(o => ({
                    variantId: variant.id,
                    optionValueId: o.valueId,
                    productOptionId: o.optionId,
                  })),
                })
              }
            }
          } else {
            const variantOptionPromises = variant.options.map(o =>
              tx.productOptionValue
                .findFirst({
                  where: { id: o.valueId },
                })
                .then(v => v?.value)
            )

            const variantOptionNames = await Promise.all(variantOptionPromises)

            if (variant.price && variant.stock) {
              const newVariant = await tx.productVariant.create({
                data: {
                  productId: dto.id,
                  sku: `SKU-${String(dto.id).padStart(3, '0')}-${dto.slug}-${variantOptionNames.join('-')}`,
                  price: variant.price,
                  stock: variant.stock,
                },
              })

              if (variant.images && variant.images.length > 0) {
                await tx.productVariantImage.createMany({
                  data: variant.images.map(image => ({
                    variantId: newVariant.id,
                    url: image,
                    alt_text: dto.name,
                  })),
                })
              }

              if (variant.options && variant.options.length > 0) {
                await tx.variantOptionValue.createMany({
                  data: variant.options.map(o => ({
                    variantId: newVariant.id,
                    optionValueId: o.valueId,
                    productOptionId: o.optionId,
                  })),
                })
              }
            }
          }
        }
      }

      return true
    })
  }

  async submitProductForm(dto: SubmitProductFormDto, userId: number) {
    return this.prisma.$transaction(async tx => {
      const newProduct = await tx.product.create({
        data: {
          name: dto.name,
          slug: slugify(dto.name),
          description: dto.description,
          status: ProductStatus.PENDING,
          brand: { connect: { id: dto.brandId } },
          category: { connect: { id: dto.category } },
        },
        include: {
          brand: true,
          category: true,
        },
      })

      await tx.activity.create({
        data: {
          entityId: newProduct.id,
          entityName: newProduct.name,
          type: 'PRODUCT_ADDED',
          createdByid: userId,
        },
      })

      for (const variant of dto.variants) {
        const variantOptionPromises = variant.options.map(o =>
          tx.productOptionValue
            .findFirst({
              where: { id: o.valueId },
            })
            .then(v => v?.value)
        )

        // Wait for all promises to resolve
        const variantOptionNames = await Promise.all(variantOptionPromises)

        const variantRecord = await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            sku: `SKU-${String(newProduct.id).padStart(3, '0')}-${newProduct.slug}-${variantOptionNames.join('-')}`,
            price: variant.price,
            stock: variant.stock,
          },
        })

        await tx.productVariantImage.createMany({
          data: variant.images.map(image => ({
            url: image,
            alt_text: dto.name,
            variantId: variantRecord.id,
          })),
        })

        await tx.variantOptionValue.createMany({
          data: variant.options.map(o => ({
            variantId: variantRecord.id,
            optionValueId: o.valueId,
            productOptionId: o.optionId,
          })),
        })
      }

      return true
    })
  }

  async getProductsByBrand(brandId: number) {
    const products = await this.prisma.product.findMany({
      where: { brandId: Number(brandId) },
      include: {
        variants: { include: { images: true } },
        category: true,
      },
    })
    return products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.variants[0]?.images[0]?.url || '/placeholder-image.jpg',
      category: product.category.name,
      status: product.status,
    }))
  }

  async autocompleteProducts(query: string) {
    const results = await esClient.search({
      index: PRODUCT_INDEX,
      body: {
        query: {
          bool: {
            should: [
              // Exact prefix match (highest priority)
              {
                prefix: {
                  name: {
                    value: query.trim().toLowerCase(),
                    boost: 3,
                  },
                },
              },
              // Phrase prefix match
              {
                match_phrase_prefix: {
                  name: {
                    query: query.trim(),
                    boost: 2,
                  },
                },
              },
              // Fuzzy matching for typos
              {
                match: {
                  name: {
                    query: query.trim(),
                    fuzziness: 'AUTO',
                    boost: 1,
                  },
                },
              },
            ],
          },
        },
        size: 10,
      },
    })

    // Extract product IDs in the order returned by Elasticsearch (by score)
    const productIds = results.hits.hits.map((hit: any) => +hit._id)

    // Fetch products from database
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { brand: true, category: true },
    })

    // Sort products to maintain Elasticsearch score order
    const sortedProducts = productIds
      .map(id => products.find(p => p.id === id))
      .filter((product): product is NonNullable<typeof product> =>
        Boolean(product)
      ) // Remove any undefined products

    return sortedProducts.map(product => product.name)
  }

  async getProductById(id: number) {
    const productRecord = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        category: { select: { id: true } },
        variants: {
          include: { images: { select: { url: true } }, optionLinks: true },
        },
        status: true,
      },
    })

    if (!productRecord) {
      throw new AppError('Product not found', 404)
    }

    const transformedProductRecord = {
      ...productRecord,
      category: productRecord.category.id,
      variants: productRecord.variants?.map(variant => {
        const { optionLinks, ...restOfVariant } = variant
        return {
          ...restOfVariant,
          images: variant.images.map(image => image.url),
          options: optionLinks.map(option => {
            const { productOptionId, optionValueId } = option
            return {
              optionId: productOptionId,
              valueId: optionValueId,
            }
          }),
        }
      }),
    }

    return transformedProductRecord
  }
  private async ensureVariantExists(id: number) {
    const variantRecord = await this.prisma.productVariant.findUnique({
      where: { id },
    })
    if (!variantRecord) throw new AppError('Variant not found', 404)
    return variantRecord
  }

  private async ensureBrandExists(id: number) {
    const brandRecord = await this.prisma.brand.findUnique({ where: { id } })
    if (!brandRecord)
      throw new AppError('brandId does not reference an existing brand', 400)
  }

  private async ensureCategoryExists(id: number) {
    const categoryRecord = await this.prisma.category.findUnique({
      where: { id },
    })
    if (!categoryRecord)
      throw new AppError(
        'categoryId does not reference an existing category',
        400
      )
  }

  private async ensureOptionExists(id: number) {
    const optionRecord = await this.prisma.productOption.findUnique({
      where: { id },
    })
    if (!optionRecord) throw new AppError('Option not found', 404)
  }

  private async ensureOptionValueExists(id: number) {
    const optionValueRecord = await this.prisma.productOptionValue.findUnique({
      where: { id },
    })
    if (!optionValueRecord) throw new AppError('Option value not found', 404)
  }

  async getProductFilters() {
    // Get all available filter options
    const [categories, brands, priceRange] = await Promise.all([
      this.prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { Product: true },
          },
        },
      }),
      this.prisma.brand.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { Product: true },
          },
        },
      }),
      this.prisma.productVariant.aggregate({
        _min: { price: true },
        _max: { price: true },
      }),
    ])

    // Get available colors and sizes from product options
    const colorOption = await this.prisma.productOption.findFirst({
      where: { name: { equals: 'Color', mode: 'insensitive' } },
      include: { values: true },
    })

    const sizeOption = await this.prisma.productOption.findFirst({
      where: { name: { equals: 'Size', mode: 'insensitive' } },
      include: { values: true },
    })

    return {
      categories: categories.filter(cat => cat._count.Product > 0),
      brands: brands.filter(brand => brand._count.Product > 0),
      price_range: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0,
      },
      colors:
        colorOption?.values.map(v => ({
          id: v.id,
          value: v.value,
        })) || [],
      sizes:
        sizeOption?.values.map(v => ({
          id: v.id,
          value: v.value,
        })) || [],
    }
  }
}

export default ProductService
