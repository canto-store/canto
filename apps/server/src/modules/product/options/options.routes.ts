import { Router } from 'express'
import { OptionController } from './options.controller'

const router = Router()

const optionController = new OptionController()

router.get('/sizes', optionController.getSizeOptions.bind(optionController))

export default router
