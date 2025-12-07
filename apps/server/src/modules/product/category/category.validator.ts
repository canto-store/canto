import { Request, Response, NextFunction } from 'express'
import {
  createCategorySchema,
  updateCategorySchema,
} from '@canto/types/category'
import AppError from '../../../utils/appError'

export class CategoryValidator {
  static validateCreate = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const result = createCategorySchema.safeParse(req.body)
    if (!result.success) {
      throw new AppError(
        result.error.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join('\n'),
        400
      )
    }
    req.body = result.data
    next()
  }

  static validateUpdate = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const result = updateCategorySchema.safeParse({
      ...req.body,
      id: Number(req.params.id),
    })
    if (!result.success) {
      throw new AppError(
        result.error.issues
          .map(i => `${i.path.join('.')}: ${i.message}`)
          .join('\n'),
        400
      )
    }
    req.body = result.data
    next()
  }
}
