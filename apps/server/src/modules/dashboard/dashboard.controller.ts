import { NextFunction, Response, Request } from 'express'
import DashboardService from './dashboard.service'

class DashboardController {
  private readonly dashboardService = new DashboardService()

  public async getActivities(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const latestActivities = await this.dashboardService.getLatestActivities()
    res.status(200).json(latestActivities)
  }
}

export default DashboardController
