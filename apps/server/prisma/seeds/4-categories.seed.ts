import { PrismaClient } from '@prisma/client'

export const name = 'categories'
export const description = 'Seed for 10 top-level categories + subcategories'

export async function run(prisma: PrismaClient): Promise<void> {
  const result = await prisma.category.createMany({
    data: [
      {
        name: "Men's Fashion",
        slug: 'mens-fashion',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimO27v5ugfckE06btChxl8rjVvPpWNQ2wu5YD4',
        aspect: 'RECTANGLE',
      },
      {
        name: "Women's Fashion",
        slug: 'womens-fashion',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimKyBO8BtOFq1T4blAzHjiQwXc0WkC5ZYo6B89',
        aspect: 'RECTANGLE',
      },
      {
        name: 'Kids',
        slug: 'kids',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimW2dfv815d5YvMyVUfKN6XS7RbFhOiwHrpPq0',
        aspect: 'SQUARE',
      },
      {
        name: 'Footwear',
        slug: 'footwear',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFim2lqe7VFSkhnjybvLaTzMmUlP84XeErOwqD3F',
        aspect: 'SQUARE',
      },
      {
        name: 'Beauty & Haircare',
        slug: 'beauty-haircare',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFim8j8RLZ34PfWMdjQY27zRpTSlK3wCBFevy6rJ',
        aspect: 'RECTANGLE',
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimvBJ8S2CvAdmu2xJh7lGU8NPQsDgiInpXVT9W',
        aspect: 'SQUARE',
      },
      {
        name: 'Gifts',
        slug: 'gifts',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFim3kaiREfSrObx2kWK78CUSDlinYXwu4EscfjF',
        aspect: 'SQUARE',
      },
      {
        name: 'Handmade',
        slug: 'handmade',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimWkkukw5d5YvMyVUfKN6XS7RbFhOiwHrpPq0A',
        aspect: 'SQUARE',
      },
      {
        name: 'Fragrances',
        slug: 'fragrances',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimNpnlz2KHOgTbtLE7BpuWrJfeK435sxV1q98j',
        aspect: 'SQUARE',
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        image:
          'https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimTrLL3K10pS2dJ8WcbliAvNPYqgTumOfezKGs',
        aspect: 'RECTANGLE',
      },
    ],
  })

  console.log(`✅ Created ${result.count} top-level categories`)

  const mensFashion = await prisma.category.findUnique({
    where: { slug: 'mens-fashion' },
  })
  const womensFashion = await prisma.category.findUnique({
    where: { slug: 'womens-fashion' },
  })

  if (mensFashion && womensFashion) {
    await prisma.category.createMany({
      data: [
        {
          name: 'Shirts',
          slug: 'mens-shirts',
          image: 'https://example.com/mens-shirts.png',
          aspect: 'SQUARE',
          parentId: mensFashion.id,
        },
        {
          name: 'Trousers',
          slug: 'mens-trousers',
          image: 'https://example.com/mens-trousers.png',
          aspect: 'SQUARE',
          parentId: mensFashion.id,
        },
        {
          name: 'Dresses',
          slug: 'womens-dresses',
          image: 'https://example.com/womens-dresses.png',
          aspect: 'SQUARE',
          parentId: womensFashion.id,
        },
        {
          name: 'Shoes',
          slug: 'womens-shoes',
          image: 'https://example.com/womens-shoes.png',
          aspect: 'SQUARE',
          parentId: womensFashion.id,
        },
      ],
    })

    console.log(`✅ Created subcategories for Men's and Women's Fashion`)
  }
}
