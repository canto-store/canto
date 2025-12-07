import { prisma } from '../../../utils/db'
import {
  AddProductToSectionDto,
  HomepageSectionDto,
  HomeProducts,
} from './home.types'

export class HomeService {
  public async getHomeProducts(): Promise<HomeProducts[]> {
    const sections = await prisma.homepageSection.findMany({
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: true,
                variants: true,
              },
            },
          },
        },
      },
    })
    return sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      position: section.position,
      created_at: section.created_at.toISOString(),
      updated_at: section.updated_at.toISOString(),
      products: section.products.map(hp => ({
        id: hp.product.id,
        position: hp.position,
        name: hp.product.name,
        slug: hp.product.slug,
        image: hp.product.image,
        brand: {
          name: hp.product.brand.name,
          slug: hp.product.brand.slug,
        },
        price: hp.product.variants[0]?.price || 0,
        stock: hp.product.variants.reduce(
          (sum, variant) => sum + variant.stock,
          0
        ),
        hasVariants: hp.product.variants.length > 1,
        default_variant_id: hp.product.variants[0]?.id || null,
      })),
    }))
  }

  public async addProductToSection(data: AddProductToSectionDto) {
    return prisma.homepageProduct.create({
      data,
    })
  }

  public async getHomeSections() {
    return prisma.homepageSection.findMany()
  }

  public async createHomeProductSection(data: HomepageSectionDto) {
    return prisma.homepageSection.create({
      data,
    })
  }

  public async updateHomeSection(id: number, data: HomepageSectionDto) {
    return prisma.homepageSection.update({
      where: { id },
      data,
    })
  }

  public async deleteHomeSection(id: number) {
    // First delete all products in this section
    await prisma.homepageProduct.deleteMany({
      where: { homepageSectionId: id },
    })

    // Then delete the section
    return prisma.homepageSection.delete({
      where: { id },
    })
  }

  public async getSectionProducts(sectionId: number) {
    return prisma.homepageProduct.findMany({
      where: { homepageSectionId: sectionId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    })
  }

  public async removeProductFromSection(id: number) {
    return prisma.homepageProduct.deleteMany({
      where: {
        productId: id,
      },
    })
  }
}
