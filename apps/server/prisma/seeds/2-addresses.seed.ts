import { PrismaClient, AddressType } from '../generated/prisma/client'

export const name = 'addresses'
export const description = 'Seed for user addresses'

export async function run(prisma: PrismaClient): Promise<void> {
  // Fetch users
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })
  const seller = await prisma.user.findUnique({
    where: { email: 'seller@example.com' },
  })
  const customer = await prisma.user.findUnique({
    where: { email: 'customer@example.com' },
  })

  if (!admin || !seller || !customer) {
    throw new Error('Users not found! Run 01-users.seed.ts first.')
  }

  // Create addresses
  await prisma.address.createMany({
    data: [
      {
        user_id: admin.id,
        type: AddressType.OFFICE,
        street_name: 'Admin Street',
        building_number: '100',
        floor: 3,
        phone_number: '+201000000001',
        address_string: 'Admin HQ, Cairo',
        sector_id: 1,
        sector_name: 'Downtown',
      },
      {
        user_id: seller.id,
        type: AddressType.HOUSE,
        street_name: 'Seller Road',
        building_number: '200B',
        floor: 2,
        phone_number: '+201000000002',
        address_string: 'Seller House, Giza',
        sector_id: 2,
        sector_name: 'Dokki',
      },
      {
        user_id: customer.id,
        type: AddressType.APARTMENT,
        street_name: 'Customer Lane',
        building_number: '12',
        apartment_number: '5A',
        floor: 5,
        phone_number: '+201000000003',
        address_string: 'Customer Apartment, Alexandria',
        sector_id: 3,
        sector_name: 'Smouha',
      },
    ],
  })

  console.log('Addresses seeded successfully!')
}
