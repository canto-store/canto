import { prisma } from '../../../utils/db'
import { CreateAddressDto } from './address.types'
import AppError from '../../../utils/appError'

class AddressService {
  async create(dto: CreateAddressDto) {
    const existingAddress = await prisma.address.findFirst({
      where: {
        user_id: dto.user_id,
        type: dto.type,
        street_name: dto.street_name,
        apartment_number: dto.apartment_number,
        floor: dto.floor,
        phone_number: dto.phone_number,
      },
    })
    if (existingAddress) {
      throw new AppError('Address already exists', 400)
    }
    const address_string = `${dto.apartment_number}, ${dto.street_name}, ${dto.sector_name}`

    const address = await prisma.address.create({
      data: {
        address_string,
        user: {
          connect: {
            id: dto.user_id,
          },
        },
        type: dto.type,
        street_name: dto.street_name,
        building_number: dto.building_number,
        apartment_number: dto.apartment_number,
        floor: dto.floor,
        phone_number: dto.phone_number,
        sector_id: dto.sector_id,
        sector_name: dto.sector_name,
      },
    })

    return address
  }

  async findAll() {
    return await prisma.address.findMany({
      select: {
        id: true,
        user_id: true,
        type: true,
        street_name: true,
        building_number: true,
        apartment_number: true,
        floor: true,
        sector_name: true,
        phone_number: true,
        additional_direction: true,
        address_label: true,
      },
    })
  }

  async findOne(id: number) {
    const address = await prisma.address.findUnique({ where: { id } })
    if (!address) throw new AppError('Address not found', 404)
    return address
  }

  async update(id: number, dto: CreateAddressDto) {
    const address = await prisma.address.findUnique({ where: { id } })
    if (!address) throw new AppError('Address not found', 404)
    return await prisma.address.update({ where: { id }, data: dto })
  }

  async delete(id: number) {
    const address = await prisma.address.findUnique({ where: { id } })
    if (!address) throw new AppError('Address not found', 404)
    return await prisma.address.delete({ where: { id } })
  }

  async findByUserId(userId: number) {
    return await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
    })
  }
}

export default AddressService
