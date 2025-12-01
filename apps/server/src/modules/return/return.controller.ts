import { Response } from 'express'
import { ReturnService } from './return.service'
import AppError from '../../utils/appError'
import { AuthRequest } from '../../middlewares/auth.middleware'

export class ReturnController {
  private returnService: ReturnService

  constructor() {
    this.returnService = new ReturnService()
  }
  async createReturn(req: AuthRequest, res: Response) {
    const { orderItemId, reason } = req.body
    const { id: userId } = req.user

    if (!orderItemId || !reason) {
      throw new AppError('orderItemId and reason are required', 400)
    }

    await this.returnService.canReturnOrderItem(orderItemId, userId)

    const returnRequest = await this.returnService.createReturn(
      orderItemId,
      reason
    )

    res.status(201).json({
      returnRequest,
    })
  }

  async getAllReturns(req: AuthRequest, res: Response) {
    const returnRequests = await this.returnService.getAllReturns()

    res.status(200).json({
      returnRequests,
    })
  }

  async getUserReturns(req: AuthRequest, res: Response) {
    const { id: userId } = req.user

    const returnRequests = await this.returnService.getReturnsByUser(userId)

    res.status(200).json({
      returnRequests,
    })
  }

  async updateReturn(req: AuthRequest, res: Response) {
    const { id, data } = req.body

    if (!id || !data) {
      throw new AppError('returnId and data are required', 400)
    }

    const updatedReturn = await this.returnService.updateReturns(+id, data)

    res.status(200).json({
      updatedReturn,
    })
  }
}
