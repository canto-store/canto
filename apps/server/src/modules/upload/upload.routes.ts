import { Router } from 'express'
import { UploadController } from './upload.controller'
import { UserRole } from '../../utils/db'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { catchAsync } from '../../utils/catchAsync'
import multer from 'multer'

const router = Router()
const authMiddleware = new AuthMiddleware()
const uploadController = new UploadController()
const upload = multer()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  upload.single('file'),
  catchAsync(uploadController.upload.bind(uploadController))
)

export default router
