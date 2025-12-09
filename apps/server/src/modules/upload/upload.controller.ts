import { Request, Response } from 'express'
import AppError from '../../utils/appError'

import { UploadService } from './upload.service'
import { UploadValidator } from './upload.validator'

export class UploadController {
  private service: UploadService
  private validator: UploadValidator

  constructor() {
    this.service = new UploadService()
    this.validator = new UploadValidator()
  }

  async upload(req: Request, res: Response) {
    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('multipart/form-data')) {
      throw new AppError('Content-Type must be multipart/form-data', 400)
    }

    const file = req.file
      ? {
          name: req.file.originalname,
          type: req.file.mimetype,
          data: req.file.buffer,
        }
      : null

    const folder = (req.body.folder as string) || 'uploads'

    this.validator.validate(file)
    const fileUrl = await this.service.upload(file!, folder)
    res.status(200).json({ success: true, fileUrl })
  }
}
