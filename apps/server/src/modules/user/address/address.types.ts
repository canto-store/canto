import { AddressType } from '@prisma/client'

export type CreateAddressDto = {
  user_id: number
  type: AddressType
  street_name: string
  building_number: string
  apartment_number?: string
  floor?: number
  area: string
  city: string
  phone_number: string
  additional_direction?: string
  address_label: string
  company_name?: string
  office_number?: string
  save_address: boolean
}
