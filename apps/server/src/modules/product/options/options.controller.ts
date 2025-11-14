import { OptionService } from './options.service'
import { Request, Response } from 'express'

export class OptionController {
  private readonly optionService: OptionService

  constructor() {
    this.optionService = new OptionService()
  }

  async getSizeOptions(_req: Request, res: Response) {
    const sizeOptions = await this.optionService.getSizeOptions()
    res.status(200).json(sizeOptions)
  }
}
