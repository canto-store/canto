import { Router } from 'express'
import DeliveryController from './delivery.controller'

const router = Router()
const deliveryController = new DeliveryController()

router.get('/', deliveryController.getAllSectors.bind(deliveryController))
export default router
