
'use strict'

import { Router } from 'express'
import * as PaymentController from '../controllers/paymentController'

const router = Router()

router.get('/summary', PaymentController.getSummary)

export default router
