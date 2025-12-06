import { Request, Response, NextFunction } from 'express'
import CategoryService from './category.service'
import { CreateCategoryDto, UpdateCategoryDto } from '@canto/types/category'
import { AuthRequest } from '../../../middlewares/auth.middleware'

class CategoryController {
  private readonly categoryService = new CategoryService()

  public async create(req: AuthRequest, res: Response) {
    const data: CreateCategoryDto = req.body
    const category = await this.categoryService.create(data)
    res.status(201).json(category)
  }

  public async getActiveCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await this.categoryService.findActiveCategories()
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.categoryService.findAll()
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryService.findOne(Number(req.params.id))
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }

  public async update(req: AuthRequest, res: Response) {
    const data: UpdateCategoryDto = req.body
    const category = await this.categoryService.update(data)
    res.status(200).json(category)
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.categoryService.delete(Number(req.params.id))
      res.status(200).json({ message: 'Category deleted', result })
    } catch (error) {
      next(error)
    }
  }
}

export default CategoryController
