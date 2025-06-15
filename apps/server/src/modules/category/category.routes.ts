import { Router } from 'express'
import CategoryController from './cateogry.controller'

const router = Router()
const categoryController = new CategoryController()

router.post('/', categoryController.create.bind(categoryController))
router.get('/', categoryController.getAll.bind(categoryController))
router.get('/:id', categoryController.getOne.bind(categoryController))
router.put('/:id', categoryController.update.bind(categoryController))
router.delete('/:id', categoryController.delete.bind(categoryController))

export default router
