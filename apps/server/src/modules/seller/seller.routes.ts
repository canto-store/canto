import { Router } from 'express'
import sellerController from './seller.controller'

const router = Router()
const controller = new sellerController()
router.get('/', controller.getAllSellers.bind(controller))
router.get('/:id', controller.getSellerById.bind(controller))
router.put('/:id', controller.updateSeller.bind(controller))
router.post('/register', controller.createSeller.bind(controller))
router.post('/login', controller.loginSeller.bind(controller))
export default router
