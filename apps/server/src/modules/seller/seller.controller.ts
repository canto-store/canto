import sellerService from './seller.service'

import { Request, Response, NextFunction } from 'express'

import { User } from '../../utils/db'

class SellerController {
  private sellerService: sellerService

  constructor() {
    this.sellerService = new sellerService()
  }

  public getAllSellers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellers = await this.sellerService.getAllSellers()
      res.status(200).json(sellers)
    } catch (error) {
      next(error)
    }
  }

  public getSellerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const seller = await this.sellerService.getSellerById(Number(id))
      res.status(200).json(seller)
    } catch (error) {
      next(error)
    }
  }

  public createSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellerData: User = req.body
      const seller = await this.sellerService.createSeller(sellerData)

      res.status(200).json(seller)
    } catch (error) {
      next(error)
    }
  }

  public updateSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const sellerData: User = req.body
      const updatedSeller = await this.sellerService.updateSeller(
        Number(id),
        sellerData
      )
      res.status(200).json(updatedSeller)
    } catch (error) {
      next(error)
    }
  }
}

export default SellerController
