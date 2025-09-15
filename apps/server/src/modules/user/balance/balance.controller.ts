import { AuthRequest } from '../../../middlewares/auth.middleware'
import { NextFunction, Response } from 'express'
import { BalanceService } from './balance.service'

export class BalanceController {
  private readonly balanceService: BalanceService

  constructor() {
    this.balanceService = new BalanceService()
  }

  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const balance = await this.balanceService.getBalance(req.user.id)
      res.status(200).json({
        balance,
      })
    } catch (error) {
      next(error)
    }
  }
}
