import axios from 'axios'
import { delivericDataInput, DelivericDataOutput } from './delivery.types'
import { DelivericOrders, PrismaClient } from '@prisma/client'

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
    deliveryData: delivericDataInput[],
    order_id: number
  ): Promise<DelivericDataOutput[]> {
    const response: DelivericDataOutput[] = await axios
      .post(this.DELIVERIC_API + '?action=addBulkShipments', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
        shipments: deliveryData,
      })
      .then(res => res.data)

    const createdDeliveryOrders = await Promise.all(
      response.map(item =>
        this.prisma.delivericOrders.create({
          data: {
            id: item.id,
            waybill: item.waybill,
            orderId: order_id,
            qrCode: item.qr_code,
          },
        })
      )
    )
    const updatedDeliveryOrders = createdDeliveryOrders.map(async order => {
      const status = await this.getDeliveryStatus(order.waybill)
      return await this.prisma.delivericOrders.update({
        where: { id: order.id },
        data: { deliveryStatus: status },
      })
    })
    const allUpdatedOrders = await Promise.all(updatedDeliveryOrders)

    return allUpdatedOrders.map(order => ({
      waybill: order.waybill,
      id: order.id,
      qr_code: order.qrCode,
      order_id: order.orderId,
      status: order.deliveryStatus,
    }))
  }

  public async getAllDeliveries(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      select: { id: true },
    })
    const orderIds = orders.map(order => order.id)

    const delivericOrders = await this.prisma.delivericOrders.findMany({
      where: { orderId: { in: orderIds } },
      select: { waybill: true },
    })

    return delivericOrders.map(
      async order => await this.getDeliveryStatus(order.waybill)
    )
  }
  public async getDelivericOrder(orderId: number) {
    return this.prisma.delivericOrders.findFirst({
      where: { orderId: orderId },
    })
  }

  public async getDeliveryStatusByOrderId(orderId: string) {
    const delivericOrder = await this.prisma.delivericOrders.findFirst({
      where: { orderId: +orderId },
      select: { waybill: true },
    })
    const { waybill } = delivericOrder
    const status = await this.getDeliveryStatus(waybill)
    return status
  }
  async updateDeliveryStatus(orderId: number): Promise<DelivericOrders> {
    const delivericOrder = await this.getDelivericOrder(orderId)
    const { waybill } = delivericOrder
    const status = await this.getDeliveryStatus(waybill)
    return await this.prisma.delivericOrders.update({
      where: { waybill },
      data: { deliveryStatus: status },
    })
  }

  private async getDeliveryStatus(waybill: string): Promise<string> {
    const res = await axios
      .post(this.DELIVERIC_API + '?action=statusHistory', {
        user: this.DELIVERIC_USER,
        password: this.DELIVERIC_PASSWORD,
        waybill,
      })
      .then(res => res.data)
    return res[0].status_en
  }
}

export default DeliveryService
