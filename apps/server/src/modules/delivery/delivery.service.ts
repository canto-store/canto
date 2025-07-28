import axios from 'axios'
import { delivericDataInput, delivericDataOutput } from './delivery.types'
import { PrismaClient } from '@prisma/client'

class DeliveryService {
  private readonly DELIVERIC_API: string
  private readonly DELIVERIC_USER: string
  private readonly DELIVERIC_PASSWORD: string
  private readonly prisma = new PrismaClient()

  constructor() {
    this.DELIVERIC_API = process.env.DELIVERIC_API
    this.DELIVERIC_USER = process.env.DELIVERIC_USER
    this.DELIVERIC_PASSWORD = process.env.DELIVERIC_PASSWORD
  }
  public async getAllSectors() {
    return axios
      .post(this.DELIVERIC_API + '?action=getAllSectors', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
      })
      .then(res => res.data)
  }

  public async createDelivery(
    deliveryData: delivericDataInput[]
  ): Promise<delivericDataOutput> {
    const response: delivericDataOutput = await axios
      .post(this.DELIVERIC_API + '?action=addBulkShipments', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
        shipments: deliveryData,
      })
      .then(res => res.data)

    await this.prisma.delivericOrders.create({
      data: {
        waybill: response.waybill,
        orderId: response.order_id,
      },
    })
    return response
  }

  public async getDeliveryStatus(waybill: string) {
    return axios
      .post(this.DELIVERIC_API + '?action=statusHistory', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
        waybill,
      })
      .then(res => res.data)
  }
}

export default DeliveryService
