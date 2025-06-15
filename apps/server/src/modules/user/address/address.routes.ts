import { Router } from 'express'
import AddressController from './address.controller'
import AuthMiddleware from '../../../middlewares/auth.middleware'

const router = Router()
const addressController = new AddressController()
const authMiddleware = new AuthMiddleware()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  addressController.create.bind(addressController)
)

router.get(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  addressController.getByUserId.bind(addressController)
)
router.put(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  addressController.update.bind(addressController)
)
router.delete(
  '/:id',
  authMiddleware.checkAuth.bind(authMiddleware),
  addressController.delete.bind(addressController)
)

export default router
