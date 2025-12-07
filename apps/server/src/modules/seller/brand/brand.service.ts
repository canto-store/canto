import { prisma, Brand, UserRole } from '../../../utils/db'
import AppError from '../../../utils/appError'
import { slugify } from '../../../utils/helper'
class BrandService {
  async getAllBrands(category?: string) {
    return await prisma.brand.findMany({
      where: {
        Product: {
          some: {
            status: 'ACTIVE',
            ...(category
              ? {
                  category: {
                    slug: category, // match category slug exactly
                  },
                }
              : {}),
          },
        },
      },
      select: {
        name: true,
        slug: true,
      },
    })
  }

  async getBrandById(id: number): Promise<Brand> {
    const brand = await prisma.brand.findUnique({
      where: { id },
    })
    if (!brand) {
      throw new AppError('Brand not found', 404)
    }
    return brand
  }

  async createBrand(
    data: Omit<Brand, 'sellerId' | 'id' | 'created_at' | 'updated_at'>,
    sellerId: number
  ): Promise<Brand> {
    const user = await prisma.user.update({
      where: { id: sellerId },
      data: {
        role: { push: UserRole.SELLER },
      },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const existingBrand = await prisma.brand.findFirst({
      where: { email: data.email },
    })

    if (existingBrand) {
      throw new AppError('Email is already in use', 409)
    }

    const slug = slugify(data.name)

    const brand = await prisma.$transaction(async t => {
      const brand = await t.brand.create({
        data: {
          ...data,
          slug,
          sellerId,
        },
      })
      await t.activity.create({
        data: {
          entityId: brand.id,
          entityName: brand.name,
          type: 'BRAND_CREATED',
        },
      })
      return brand
    })
    return brand
  }

  async updateBrand(id: number, data: Brand): Promise<Brand> {
    const existing = await prisma.brand.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new AppError('Brand not found', 404)
    }
    if (data.email && data.email !== existing.email) {
      const emailTaken = await prisma.brand.findUnique({
        where: { email: data.email },
      })
      if (emailTaken) {
        throw new AppError('Email is already in use by another brand', 400)
      }
    }
    return await prisma.brand.update({
      where: { id },
      data,
    })
  }

  async deleteBrand(id: number): Promise<Brand> {
    const existing = await prisma.brand.findUnique({
      where: { id },
    })
    if (!existing) {
      throw new AppError('Brand not found', 404)
    }
    return await prisma.brand.delete({
      where: { id },
    })
  }

  async getMyBrand(sellerId: number): Promise<Brand> {
    const brand = await prisma.brand.findFirst({
      where: { sellerId },
    })
    return brand
  }
}

export default BrandService
