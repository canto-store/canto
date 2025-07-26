import { Request, Response, NextFunction } from 'express'
import DeliveryService from './delivery.service'

class DeliveryController {
  private readonly deliveryService: DeliveryService

  constructor() {
    this.deliveryService = new DeliveryService()
  }

  public async getAllSectors(req: Request, res: Response, next: NextFunction) {
    try {
      const sectors = await this.deliveryService.getAllSectors()
      res.status(200).json(sectors)
    } catch (err) {
      next(err)
    }
  }
}

export default DeliveryController
