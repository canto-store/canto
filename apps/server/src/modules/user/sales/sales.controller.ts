import { AuthRequest } from '../../../middlewares/auth.middleware'
import { NextFunction, Response } from 'express'
import { SalesService } from './sales.service'

export class SalesController {
  private readonly salesService: SalesService
  constructor() {
    this.salesService = new SalesService()
  }

  async getSales(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sales = await this.salesService.getSales(req.user.id)
      res.status(200).json({
        sales,
      })
    } catch (error) {
      next(error)
    }
  }
}
