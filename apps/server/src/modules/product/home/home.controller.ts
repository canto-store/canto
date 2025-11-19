import { Request, Response } from 'express'
import { HomeService } from './home.service'

export class HomeController {
  private homeService: HomeService

  constructor() {
    this.homeService = new HomeService()
  }

  public async getHomeProducts(req: Request, res: Response): Promise<void> {
    const products = await this.homeService.getHomeProducts()
    res.status(200).json(products)
  }

  public async addProductToSection(req: Request, res: Response): Promise<void> {
    const product = await this.homeService.addProductToSection(req.body)
    res.status(201).json(product)
  }
  public async getHomeSections(req: Request, res: Response): Promise<void> {
    const sections = await this.homeService.getHomeSections()
    res.status(200).json(sections)
  }

  public async createHomeProductSection(
    req: Request,
    res: Response
  ): Promise<void> {
    const section = await this.homeService.createHomeProductSection(req.body)
    res.status(201).json(section)
  }

  public async updateHomeSection(req: Request, res: Response): Promise<void> {
    const sectionId = parseInt(req.params.id)
    const section = await this.homeService.updateHomeSection(
      sectionId,
      req.body
    )
    res.status(200).json(section)
  }

  public async deleteHomeSection(req: Request, res: Response): Promise<void> {
    const sectionId = parseInt(req.params.id)
    await this.homeService.deleteHomeSection(sectionId)
    res.status(204).send()
  }

  public async getSectionProducts(req: Request, res: Response): Promise<void> {
    const sectionId = parseInt(req.params.id)
    const products = await this.homeService.getSectionProducts(sectionId)
    res.status(200).json(products)
  }

  public async removeProductFromSection(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = parseInt(req.params.id)
    await this.homeService.removeProductFromSection(id)
    res.status(204).send()
  }
}
