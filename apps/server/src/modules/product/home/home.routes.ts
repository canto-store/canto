import { Router } from 'express'
import { HomeController } from './home.controller'
import { catchAsync } from '../../../utils/catchAsync'

class HomeRouter {
  public router: Router
  private homeController: HomeController
  constructor() {
    this.router = Router()
    this.homeController = new HomeController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Homepage products endpoints
    this.router.get(
      '/products',
      catchAsync(this.homeController.getHomeProducts.bind(this.homeController))
    )
    this.router.post(
      '/products',
      catchAsync(
        this.homeController.addProductToSection.bind(this.homeController)
      )
    )

    // Homepage sections endpoints
    this.router.get(
      '/sections',
      catchAsync(this.homeController.getHomeSections.bind(this.homeController))
    )
    this.router.post(
      '/sections',
      catchAsync(
        this.homeController.createHomeProductSection.bind(this.homeController)
      )
    )
    this.router.put(
      '/sections/:id',
      catchAsync(
        this.homeController.updateHomeSection.bind(this.homeController)
      )
    )
    this.router.delete(
      '/sections/:id',
      catchAsync(
        this.homeController.deleteHomeSection.bind(this.homeController)
      )
    )

    // Section products endpoints
    this.router.get(
      '/sections/:id/products',
      catchAsync(
        this.homeController.getSectionProducts.bind(this.homeController)
      )
    )
    this.router.delete(
      '/sections/products/:id',
      catchAsync(
        this.homeController.removeProductFromSection.bind(this.homeController)
      )
    )
  }
}
const homeRouter = new HomeRouter().router
export default homeRouter
