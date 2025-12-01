import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

async function seedCategories() {
  const prisma = new PrismaClient()

  console.log('Starting category seeding...')

  // Update Fragrances to Active & Displayed
  const fragrances = await prisma.category.findUnique({
    where: { slug: 'fragrances' },
  })
  if (fragrances) {
    await prisma.category.update({
      where: { id: fragrances.id },
      data: { coming_soon: false },
    })
    console.log('✓ Updated Fragrances to Active & Displayed')

    // Add Candles subcategory to Fragrances
    const candles = await prisma.category.findFirst({
      where: { slug: 'candles', parentId: fragrances.id },
    })
    if (!candles) {
      await prisma.category.create({
        data: {
          name: 'Candles',
          slug: 'candles',
          aspect: 'SQUARE',
          coming_soon: false,
          parentId: fragrances.id,
        },
      })
      console.log('✓ Created Candles subcategory under Fragrances')
    }
  }

  // Create or update Home category
  let home = await prisma.category.findUnique({
    where: { slug: 'home' },
  })
  if (!home) {
    home = await prisma.category.create({
      data: {
        name: 'Home',
        slug: 'home',
        aspect: 'SQUARE',
        image:
          'https://canto-storage.fra1.cdn.digitaloceanspaces.com/screenshot-2025-11-21_17-43-01.png',
        coming_soon: false,
      },
    })
    console.log('✓ Created Home category')
  } else {
    await prisma.category.update({
      where: { id: home.id },
      data: { coming_soon: false },
    })
    console.log('✓ Updated Home to Active & Displayed')
  }

  // Add subcategories to Home
  const homeSubcategories = [
    { name: 'Pottery', slug: 'pottery' },
    { name: 'Kitchen', slug: 'kitchen' },
  ]

  for (const subcat of homeSubcategories) {
    const existing = await prisma.category.findFirst({
      where: { slug: subcat.slug, parentId: home.id },
    })
    if (!existing) {
      await prisma.category.create({
        data: {
          name: subcat.name,
          slug: subcat.slug,
          aspect: 'SQUARE',
          coming_soon: false,
          parentId: home.id,
        },
      })
      console.log(`✓ Created ${subcat.name} subcategory under Home`)
    }
  }

  // Delete old Pottery-Kitchen if it exists
  const oldPotteryKitchen = await prisma.category.findUnique({
    where: { slug: 'pottery-kitchen' },
  })
  if (oldPotteryKitchen) {
    await prisma.category.delete({
      where: { id: oldPotteryKitchen.id },
    })
    console.log('✓ Deleted old Pottery-Kitchen category')
  }

  // Update Accessories to Jewelry & Accessories
  const accessories = await prisma.category.findUnique({
    where: { slug: 'accessories' },
  })
  let jewelryAccessories
  if (accessories) {
    jewelryAccessories = await prisma.category.update({
      where: { id: accessories.id },
      data: {
        name: 'Jewelry & Accessories',
        slug: 'jewelry-accessories',
        coming_soon: false,
      },
    })
    console.log('✓ Updated Accessories to Jewelry & Accessories')
  }

  // Add subcategories to Jewelry & Accessories
  if (jewelryAccessories) {
    const jewelrySubcategories = [
      { name: 'Belts', slug: 'belts' },
      { name: 'Necklaces', slug: 'necklaces' },
      { name: 'Rings', slug: 'rings' },
      { name: 'Earrings', slug: 'earrings' },
    ]

    for (const subcat of jewelrySubcategories) {
      const existing = await prisma.category.findFirst({
        where: { slug: subcat.slug, parentId: jewelryAccessories.id },
      })
      if (!existing) {
        await prisma.category.create({
          data: {
            name: subcat.name,
            slug: subcat.slug,
            aspect: 'SQUARE',
            coming_soon: false,
            parentId: jewelryAccessories.id,
          },
        })
        console.log(
          `✓ Created ${subcat.name} subcategory under Jewelry & Accessories`
        )
      }
    }
  }

  // Update Beauty & Haircare to Beauty & Skin Care with Coming Soon status
  const beautyHaircare = await prisma.category.findUnique({
    where: { slug: 'beauty-haircare' },
  })
  if (beautyHaircare) {
    await prisma.category.update({
      where: { id: beautyHaircare.id },
      data: {
        name: 'Beauty & Skin Care',
        slug: 'beauty-skin-care',
        coming_soon: true,
      },
    })
    console.log(
      '✓ Updated Beauty & Haircare to Beauty & Skin Care (Coming Soon)'
    )

    // Add Skin Care subcategory
    const skinCare = await prisma.category.findFirst({
      where: { slug: 'skin-care', parentId: beautyHaircare.id },
    })
    if (!skinCare) {
      await prisma.category.create({
        data: {
          name: 'Skin Care',
          slug: 'skin-care',
          aspect: 'SQUARE',
          coming_soon: true,
          parentId: beautyHaircare.id,
        },
      })
      console.log('✓ Created Skin Care subcategory under Beauty & Skin Care')
    }
  }

  // Update Women's Fashion to Coming Soon
  const womensFashion = await prisma.category.findUnique({
    where: { slug: 'womens-fashion' },
  })
  if (womensFashion) {
    await prisma.category.update({
      where: { id: womensFashion.id },
      data: {
        coming_soon: true,
      },
    })
    console.log("✓ Updated Women's Fashion to Fashion Women (Coming Soon)")
  }

  // Update Men's Fashion to Coming Soon
  const mensFashion = await prisma.category.findUnique({
    where: { slug: 'mens-fashion' },
  })
  if (mensFashion) {
    await prisma.category.update({
      where: { id: mensFashion.id },
      data: {
        coming_soon: true,
      },
    })
    console.log("✓ Updated Men's Fashion to Fashion Men (Coming Soon)")
  }

  // Update Kids to Coming Soon
  const kids = await prisma.category.findUnique({
    where: { slug: 'kids' },
  })
  if (kids) {
    await prisma.category.update({
      where: { id: kids.id },
      data: { coming_soon: true },
    })
    console.log('✓ Updated Kids to Coming Soon')
  }

  // Update Footwear to Coming Soon
  const footwear = await prisma.category.findUnique({
    where: { slug: 'footwear' },
  })
  if (footwear) {
    await prisma.category.update({
      where: { id: footwear.id },
      data: { coming_soon: true },
    })
    console.log('✓ Updated Footwear to Coming Soon')
  }

  // Update Handmade to Coming Soon
  const handmade = await prisma.category.findUnique({
    where: { slug: 'handmade' },
  })
  if (handmade) {
    await prisma.category.update({
      where: { id: handmade.id },
      data: { coming_soon: true },
    })
    console.log('✓ Updated Handmade to Coming Soon')
  }

  // Update Furniture to Coming Soon
  const furniture = await prisma.category.findUnique({
    where: { slug: 'furniture' },
  })
  if (furniture) {
    await prisma.category.update({
      where: { id: furniture.id },
      data: { coming_soon: true },
    })
    console.log('✓ Updated Furniture to Coming Soon')
  }

  // Delete Gifts category
  const gifts = await prisma.category.findUnique({
    where: { slug: 'gifts' },
  })
  if (gifts) {
    await prisma.category.delete({
      where: { id: gifts.id },
    })
    console.log('✓ Deleted Gifts category')
  }

  console.log('Category seeding completed!')
  await prisma.$disconnect()
}

// Run category seeding
seedCategories().catch(err => {
  console.error('Fatal error during category seeding:', err)
  process.exit(1)
})
