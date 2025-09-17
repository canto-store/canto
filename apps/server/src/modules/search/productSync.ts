// src/services/elasticsearch/productSync.ts
import { PrismaClient } from '@prisma/client'
import { esClient } from '.'
import { PRODUCT_INDEX } from './productIndex'

const prisma = new PrismaClient()

export const syncProductsToES = async () => {
  try {
    console.log('Starting product sync to Elasticsearch...')

    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        description: true,
      },
    })

    console.log(`Found ${products.length} products to sync`)

    const bulkOps: any[] = []

    for (const product of products) {
      bulkOps.push(
        { index: { _index: PRODUCT_INDEX, _id: product.id } },
        {
          id: product.id,
          name: product.name,
          description: product.description || '',
        }
      )
    }

    if (bulkOps.length > 0) {
      const response = await esClient.bulk({ body: bulkOps })

      if (response.errors) {
        console.error('Some products failed to index')
      } else {
        console.log(`Successfully synced ${products.length} products`)
      }
    }
  } catch (error) {
    console.error('Error syncing products:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
