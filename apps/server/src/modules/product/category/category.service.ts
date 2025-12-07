import { prisma } from '../../../utils/db'
import { CreateCategoryDto, UpdateCategoryDto } from '@canto/types/category'
import AppError from '../../../utils/appError'
import { slugify } from '../../../utils/helper'

class CategoryService {
  async create(dto: CreateCategoryDto): Promise<boolean> {
    const slug = slugify(dto.name)
    await prisma.category.create({ data: { ...dto, slug } })
    return true
  }

  async findAll() {
    return await prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            aspect: true,
            coming_soon: true,
          },
          orderBy: {
            coming_soon: 'asc',
          },
        },
      },
      orderBy: {
        coming_soon: 'asc',
      },
    })
  }
  async findActiveCategories() {
    return await prisma.category.findMany({
      where: {
        parentId: null,
        OR: [
          {
            Product: {
              some: { status: 'ACTIVE' },
            },
          },
          {
            children: {
              some: {
                Product: {
                  some: { status: 'ACTIVE' },
                },
              },
            },
          },
        ],
      },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            aspect: true,
            coming_soon: true,
          },
          where: {
            Product: {
              some: { status: 'ACTIVE' },
            },
          },
        },
      },
    })
  }

  async findOne(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true } },
      },
    })

    if (!category) throw new AppError('Category not found', 404)
    return category
  }

  async update(dto: UpdateCategoryDto) {
    const category = await prisma.category.findUnique({
      where: { id: dto.id },
    })
    if (!category) throw new AppError('Category not found', 404)

    return await prisma.category.update({
      where: { id: dto.id },
      data: dto,
    })
  }

  async delete(id: number) {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) throw new AppError('Category not found', 404)

    return await prisma.category.delete({ where: { id } })
  }
}

export default CategoryService
