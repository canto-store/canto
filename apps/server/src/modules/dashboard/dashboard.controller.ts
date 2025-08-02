import { NextFunction, Response, Request } from 'express'
import DashboardService from './dashboard.service'

class DashboardController {
  private readonly dashboardService = new DashboardService()

  public async getLatestActivities(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const latestActivities = await this.dashboardService.getLatestActivities()
    res.status(200).json(latestActivities)
  }

  public async getDashboardCounts(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const body = await this.dashboardService.getDashboardCounts()
    res.status(200).json(body)
  }
}

export default DashboardController
