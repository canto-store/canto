import { Prisma, PrismaClient } from "@prisma/client";
import AppError from "../../utils/appError";
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductOptionDto,
  CreateProductOptionValueDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  SubmitProductFormDto,
  ProductStatus,
} from "./product.types";
import { slugify } from "../../utils/helper";

class ProductService {
  private readonly prisma = new PrismaClient();

  async createProduct(dto: CreateProductDto) {
    if (!dto.name?.trim()) throw new AppError("name is required", 400);
    if (!dto.slug?.trim()) throw new AppError("slug is required", 400);

    await this.ensureBrandExists(dto.brandId);
    await this.ensureCategoryExists(dto.categoryId);

    const existingProductWithSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existingProductWithSlug)
      throw new AppError("Product with this slug already exists", 409);

    return this.prisma.product.create({ data: dto });
  }

  async findAllProducts() {
    return this.prisma.product.findMany({
      include: { brand: true, category: true },
    });
  }

  async findProduct(id: number) {
    await this.ensureProductExists(id);
    return this.prisma.product.findUnique({ where: { id } });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const existingProduct = await this.ensureProductExists(id);

    if (dto.slug && dto.slug !== existingProduct.slug) {
      const existingProductWithSlug = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existingProductWithSlug)
        throw new AppError("slug already in use", 409);
    }

    if (dto.brandId && dto.brandId !== existingProduct.brandId) {
      await this.ensureBrandExists(dto.brandId);
    }
    if (dto.categoryId && dto.categoryId !== existingProduct.categoryId) {
      await this.ensureCategoryExists(dto.categoryId);
    }

    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async deleteProduct(id: number) {
    await this.ensureProductExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async createOption(dto: CreateProductOptionDto) {
    if (!dto.name?.trim()) throw new AppError("name is required", 400);

    const existingOptionWithName = await this.prisma.productOption.findUnique({
      where: { name: dto.name },
    });
    if (existingOptionWithName)
      throw new AppError("Option with this name already exists", 409);

    return this.prisma.productOption.create({ data: dto });
  }

  async getOptions() {
    return this.prisma.productOption.findMany({ include: { values: true } });
  }

  async deleteOption(id: number) {
    await this.ensureOptionExists(id);
    return this.prisma.productOption.delete({ where: { id } });
  }

  async createOptionValue(dto: CreateProductOptionValueDto) {
    if (!dto.value?.trim()) throw new AppError("value is required", 400);
    await this.ensureOptionExists(dto.productOptionId);

    const existingOptionValue = await this.prisma.productOptionValue.findFirst({
      where: { productOptionId: dto.productOptionId, value: dto.value },
    });
    if (existingOptionValue)
      throw new AppError("Value already exists under this option", 409);

    return this.prisma.productOptionValue.create({ data: dto });
  }

  async deleteOptionValue(id: number) {
    await this.ensureOptionValueExists(id);
    return this.prisma.productOptionValue.delete({ where: { id } });
  }

  async createVariant(dto: CreateProductVariantDto) {
    await this.ensureProductExists(dto.productId);
    if (!dto.sku?.trim()) throw new AppError("sku is required", 400);
    if (dto.price == null || dto.price < 0)
      throw new AppError("price must be >= 0", 400);
    if (dto.stock == null || dto.stock < 0)
      throw new AppError("stock must be >= 0", 400);

    const existingVariantSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    });
    if (existingVariantSku)
      throw new AppError("Variant with this SKU already exists", 409);

    if (dto.optionValueIds?.length) {
      await Promise.all(
        dto.optionValueIds.map((id) => this.ensureOptionValueExists(id))
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const variantRecord = await tx.productVariant.create({
        data: {
          productId: dto.productId,
          sku: dto.sku,
          price: dto.price,
          stock: dto.stock,
          sale_id: dto.sale_id ?? null,
        },
      });

      if (dto.optionValueIds?.length) {
        const variantOptionValuesData = await Promise.all(
          dto.optionValueIds.map(async (optionValueId) => {
            const productOptionValue = await tx.productOptionValue.findUnique({
              where: { id: optionValueId },
              select: { productOptionId: true },
            });
            if (!productOptionValue) {
              throw new AppError(
                `ProductOptionValue with id ${optionValueId} not found within transaction.`,
                404
              );
            }
            if (productOptionValue.productOptionId == null) {
              throw new AppError(
                `ProductOptionValue with id ${optionValueId} is missing its productOptionId.`,
                500
              );
            }
            return {
              variantId: variantRecord.id,
              optionValueId,
              productOptionId: productOptionValue.productOptionId,
            };
          })
        );

        await tx.variantOptionValue.createMany({
          data: variantOptionValuesData,
        });
      }

      if (dto.images?.length) {
        await tx.productVariantImage.createMany({
          data: dto.images.map((image) => ({
            ...image,
            variantId: variantRecord.id,
          })),
        });
      }

      return tx.productVariant.findUnique({
        where: { id: variantRecord.id },
        include: {
          images: true,
          optionLinks: { include: { optionValue: true } },
        },
      });
    });
  }

  async updateVariant(id: number, dto: UpdateProductVariantDto) {
    const existingVariant = await this.ensureVariantExists(id);

    if (dto.sku && dto.sku !== existingVariant.sku) {
      const existingVariantSku = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      });
      if (existingVariantSku) throw new AppError("SKU already in use", 409);
    }
    if (dto.price != null && dto.price < 0)
      throw new AppError("price must be >= 0", 400);
    if (dto.stock != null && dto.stock < 0)
      throw new AppError("stock must be >= 0", 400);

    const updateData: Prisma.ProductVariantUpdateInput = {};
    if (dto.sku != null) updateData.sku = dto.sku;
    if (dto.price != null) updateData.price = dto.price;
    if (dto.stock != null) updateData.stock = dto.stock;
    if (dto.sale_id != null) updateData.sale = { connect: { id: dto.sale_id } };

    const variantRecord = await this.prisma.productVariant.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
        optionLinks: { include: { optionValue: true } },
      },
    });

    if (dto.optionValueIds || dto.images) {
      return this.prisma.$transaction(async (tx) => {
        if (dto.optionValueIds) {
          await tx.variantOptionValue.deleteMany({ where: { variantId: id } });
          if (dto.optionValueIds.length) {
            await tx.variantOptionValue.createMany({
              data: dto.optionValueIds.map((optionValueId) => ({
                variantId: id,
                optionValueId,
                productOptionId: dto.productOptionId,
              })),
            });
          }
        }

        if (dto.images) {
          await tx.productVariantImage.deleteMany({ where: { variantId: id } });
          if (dto.images.length) {
            await tx.productVariantImage.createMany({
              data: dto.images.map((image) => ({ ...image, variantId: id })),
            });
          }
        }

        return tx.productVariant.findUnique({
          where: { id },
          include: {
            images: true,
            optionLinks: { include: { optionValue: true } },
          },
        });
      });
    }

    return variantRecord;
  }

  async deleteVariant(id: number) {
    await this.ensureVariantExists(id);
    return this.prisma.productVariant.delete({ where: { id } });
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
          },
        },
      },
    });

    if (!productRecord) throw new AppError("Product not found", 404);

    const priceList = productRecord.variants.map((v) => v.price);
    const minimumPrice = priceList.length ? Math.min(...priceList) : 0;
    const maximumPrice = priceList.length ? Math.max(...priceList) : 0;

    const optionMap = new Map<string, Set<string>>();
    productRecord.variants.forEach((variant) =>
      variant.optionLinks.forEach((link) => {
        const optionName = link.optionValue.productOption.name;
        const optionValueText = link.optionValue.value;
        if (!optionMap.has(optionName)) optionMap.set(optionName, new Set());
        optionMap.get(optionName)!.add(optionValueText);
      })
    );
    const options = [...optionMap.entries()].map(([name, valueSet]) => ({
      name,
      values: [...valueSet],
    }));

    const variants = productRecord.variants.map((variant) => {
      const variantOptions: Record<string, string> = {};
      variant.optionLinks.forEach((link) => {
        variantOptions[link.optionValue.productOption.name] =
          link.optionValue.value;
      });
      return {
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        options: variantOptions,
        images: variant.images.map((image) => ({
          url: image.url,
          alt_text: image.alt_text,
        })),
      };
    });

    const relatedRaw = await this.prisma.product.findMany({
      where: {
        categoryId: productRecord.categoryId,
        id: { not: productRecord.id },
      },
      take: 4,
      include: { brand: true, variants: { include: { images: true } } },
    });

    const relatedProducts = relatedRaw.map((related) => {
      const relatedPrices = related.variants.map((v) => v.price);
      return {
        id: related.id,
        name: related.name,
        slug: related.slug,
        image: related.variants[0]?.images[0]?.url ?? "",
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
      };
    });

    return {
      name: productRecord.name,
      slug: productRecord.slug,
      description: productRecord.description,
      brand: productRecord.brand,
      category: productRecord.category,
      price_range: {
        min_price: minimumPrice,
        max_price: maximumPrice,
      },
      options,
      variants,
      ...(productRecord.sizeChart
        ? { sizeChart: productRecord.sizeChart }
        : {}),
      reviews: { count: 0, rating: 0 },
      related_products: relatedProducts,
    };
  }

  async getHomeProducts() {
    const products = await this.prisma.product.findMany({
      select: {
        name: true,
        brand: { select: { name: true, slug: true } },
        slug: true,
        variants: { select: { images: true, price: true } },
      },
    });
    const bestSellers = products.slice(0, 5).map((product) => ({
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: Math.min(...product.variants.map((v) => v.price)),
      image: product.variants[0]?.images[0]?.url ?? "",
    }));
    const bestDeals = products.slice(5, 10).map((product) => ({
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: Math.min(...product.variants.map((v) => v.price)),
      image: product.variants[0]?.images[0]?.url ?? "",
    }));
    const newArrivals = products.slice(10, 15).map((product) => ({
      name: product.name,
      brand: product.brand,
      slug: product.slug,
      price: Math.min(...product.variants.map((v) => v.price)),
      image: product.variants[0]?.images[0]?.url ?? "",
    }));
    return {
      bestSellers,
      bestDeals,
      newArrivals,
    };
  }

  async submitProductForm(dto: SubmitProductFormDto) {
    return this.prisma.$transaction(async (tx) => {
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
      });

      for (const variant of dto.variants) {
        const variantRecord = await tx.productVariant.create({
          data: {
            productId: newProduct.id,
            sku: slugify(variant.options.map((o) => o.valueId).join("-")),
            price: variant.price,
            stock: variant.stock,
          },
        });

        await tx.productVariantImage.createMany({
          data: variant.images.map((image) => ({
            url: image,
            variantId: variantRecord.id,
          })),
        });

        await tx.variantOptionValue.createMany({
          data: variant.options.map((o) => ({
            variantId: variantRecord.id,
            optionValueId: o.valueId,
            productOptionId: o.optionId,
          })),
        });
      }

      return true;
    });
  }

  async getProductsByBrand(brandId: number) {
    const products = await this.prisma.product.findMany({
      where: { brandId: Number(brandId) },
      include: {
        variants: { include: { images: true } },
        category: true,
      },
    });
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.variants[0]?.images[0]?.url ?? "",
      category: product.category.name,
      status: product.status,
    }));
  }

  private async ensureProductExists(id: number) {
    const productRecord = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!productRecord) throw new AppError("Product not found", 404);
    return productRecord;
  }

  private async ensureVariantExists(id: number) {
    const variantRecord = await this.prisma.productVariant.findUnique({
      where: { id },
    });
    if (!variantRecord) throw new AppError("Variant not found", 404);
    return variantRecord;
  }

  private async ensureBrandExists(id: number) {
    const brandRecord = await this.prisma.brand.findUnique({ where: { id } });
    if (!brandRecord)
      throw new AppError("brandId does not reference an existing brand", 400);
  }

  private async ensureCategoryExists(id: number) {
    const categoryRecord = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!categoryRecord)
      throw new AppError(
        "categoryId does not reference an existing category",
        400
      );
  }

  private async ensureOptionExists(id: number) {
    const optionRecord = await this.prisma.productOption.findUnique({
      where: { id },
    });
    if (!optionRecord) throw new AppError("Option not found", 404);
  }

  private async ensureOptionValueExists(id: number) {
    const optionValueRecord = await this.prisma.productOptionValue.findUnique({
      where: { id },
    });
    if (!optionValueRecord) throw new AppError("Option value not found", 404);
  }
}

export default ProductService;
