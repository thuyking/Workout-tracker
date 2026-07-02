import { Router } from 'express'

import { getLocales } from '../controllers/localeController'

const router = Router()

router.get('/', getLocales)

export default router
